import { Resolver, Authorized, Mutation, Arg, Query, ID } from 'type-graphql';
import { DocumentVersion } from "../../entity/DocumentVersion";
import { Language } from "../../entity/Language";
import { Pdf } from "../../entity/Pdf";
import { Document } from "../../entity/Document";
import { Organization } from "../../entity/Organization";
import { User } from "../../entity/User";
import { CreateDocumentVersionInput } from './inputTypes';
import { IsMyOrganization } from '../../decorators/is-my-organization';
import { CurrentUser, CurrentOrganization } from "../../decorators/current";

@Resolver()
export class DocumentVersionResolver {
  @IsMyOrganization()
  @Authorized('user')
  @Mutation(() => DocumentVersion)
  async createDocumentVersion(
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Arg("data") { documentId, pdfId, languageId, title, version, description }: CreateDocumentVersionInput,
  ) : Promise<DocumentVersion> {
    const document = await Document.findOne({where: {
      id: documentId,
      user: user,
      organization: organization
    }});

    if(!document) throw new Error("Document not found");

    const pdf = await Pdf.findOne({where: {
      id: pdfId,
      user: user,
      organization: organization
    }});

    if(!pdf) throw new Error("Pdf not found");

    const language = await Language.findOne({where: {
      id: languageId
    }});

    if(!language) throw new Error("Language not found");

    const documentVersion = new DocumentVersion();
    documentVersion.title = title;
    documentVersion.version = version;
    documentVersion.description = description;
    documentVersion.language = language;
    documentVersion.pdf = pdf;
    documentVersion.document = document;
    documentVersion.organization = organization;
    documentVersion.user = user;

    return documentVersion.save();
  }

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => [DocumentVersion])
  async getMyDocumentVersions(
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Arg("documentId", () => ID) id: number,
  ) : Promise<DocumentVersion[]> {
    const document = await Document.findOne({where: {
      user: user,
      id: id,
      organization: organization
    }});

    if(!document) throw new Error("Document not found");

    const documentVersions = await DocumentVersion.find({
      where: {
        user: user,
        organization: organization,
        document: document
      }
    });

    return documentVersions
  }

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => DocumentVersion)
  async getMyDocumentVersion(
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User,
    @Arg("documentVersionId", () => ID) id: number,
  ) : Promise<DocumentVersion> {
    const documentVersion = await DocumentVersion.findOne({
      where: {
        user: user,
        id: id,
        organization: organization
      }
    });

    if(!documentVersion) throw new Error("Document version not found");

    return documentVersion
  }
}
