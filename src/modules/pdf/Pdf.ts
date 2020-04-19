import { Resolver, Mutation, Arg, Authorized } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload'
import { Pdf } from "../../entity/Pdf";
import { Organization } from "../../entity/Organization";
import { User } from "../../entity/User";
import { IsMyOrganization } from '../../decorators/is-my-organization';
import { CurrentUser, CurrentOrganization } from "../../decorators/current";

import aws from 'aws-sdk';
import UploadStream from 's3-stream-upload';
import {v4} from 'uuid';
import { config } from 'node-config-ts'
import Queue from 'bull';

const workQueue = new Queue('pdf', config.redisUrl);

aws.config.update({
  accessKeyId: config.amazon.accessKey,
  secretAccessKey: config.amazon.secretAccessKey,
  region: config.amazon.region,
  signatureVersion: 'v4'
})

@Resolver()
export class PdfResolver {
  @IsMyOrganization()
  @Authorized('user')
  @Mutation(() => Pdf)
  async uploadPdf(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User
  ):Promise<Pdf> {
    const stream = file.createReadStream();
    const key = v4();

    const s3 = new aws.S3({
      endpoint: config.documentUrl, 
      s3BucketEndpoint: true
    });

    const upload = UploadStream(s3, {
      Bucket: config.amazon.bucket,
      Key: `pdfs/${key}.pdf`,
      ContentType: 'application/pdf'
    });

    await new Promise((resolve, reject) => {
      stream.pipe(upload).on('finish', () => {
  	    resolve('finished')
      }).on('error', (err) => {
        reject(err);
      });
    })

    await workQueue.add({document: key});

    const pdf = new Pdf();
    pdf.name = file.filename;
    pdf.documentId = key;
    pdf.user = user;
    pdf.organization = organization;

    return pdf.save();
  }
}

workQueue.on('global:progress', (jobId, progress) => {
  console.log(`Job ${jobId} is ${progress * 100}% ready!`);
});
