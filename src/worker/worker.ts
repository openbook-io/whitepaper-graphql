import Queue from 'bull';
import { config } from 'node-config-ts';
import { PdfExtractor } from 'openbook-pdf-processor';
import { Pdf } from "../entity/Pdf";
import { PdfPage } from "../entity/PdfPage";

const maxJobsPerWorker = 4;

const pdfExtractor = new PdfExtractor({
	accessKeyId: config.amazon.accessKey,
  secretAccessKey: config.amazon.secretAccessKey,
  region: config.amazon.region,
	signatureVersion: 'v4',
	bucket: config.amazon.bucket,
	accessUrl: config.documentUrl
}, {
	viewportScale: (width) => {
		return 1940 / width;
	},
	pageRange: [1, Infinity]
});

function start() {
  // Connect to the named work queue
  let workQueue = new Queue('pdf', config.redisUrl);

  workQueue.process(maxJobsPerWorker, async (job) => {
    const documentId = job.data.document;
    const amazonPdfWorker = pdfExtractor.parseFromAmazonS3(documentId);

    amazonPdfWorker.onProgress(progress => {
      console.log(`${progress * 100}%`)
      job.progress(progress * 100)
    });

    const data = await amazonPdfWorker

    const pdf = await Pdf.findOne({where: {
      documentId
    }});

    if(!pdf) throw new Error("documentId not found");

    let pages: PdfPage[] = []

    data.jsonData.pages.map((currentPage) => {
      let page = new PdfPage();
      page.number = currentPage.number;
      page.key = currentPage.key;
      page.width = currentPage.width;
      page.height = currentPage.height;
      page.scale = currentPage.scale;
      page.pdf = pdf;

      pages.push(page)
    })

    pdf.pages = pages;

    await pdf.save();
  });
}

export default start

