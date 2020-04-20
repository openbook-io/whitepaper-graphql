import { Resolver, Authorized, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { Document } from "../../entity/Document";
import { DocumentType } from "../../entity/DocumentType";
import { DocumentVersion } from "../../entity/DocumentVersion";
import { User } from "../../entity/User";
import { Organization } from "../../entity/Organization";
import { CurrentUser, CurrentOrganization } from "../../decorators/current";
import { CreateDocumentInput } from './inputTypes';
import { IsMyOrganization } from '../../decorators/is-my-organization';

@Resolver(Document)
export class DocumentResolver {
  @IsMyOrganization()
  @Authorized('user')
  @Mutation(() => Document)
  async createDocument(
    @Arg("data") { documentTypeId, documentTypeText }: CreateDocumentInput,
    @CurrentOrganization() organization: Organization,
    @CurrentUser() user: User
  ) : Promise<Document> {
    const documentType = await DocumentType.findOne(documentTypeId);

    if(!documentType) throw new Error("Document type not found");

    const document = new Document();
    document.createdBy = user;
    document.organization = organization;
    document.type = documentType;
    document.typeText = documentTypeText;
    
    return document.save();
  }

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => [Document])
  async myDocuments(
    @CurrentOrganization() organization: Organization
  ): Promise <Document[]> {
    const documents = Document.find({
      where: {
        organization
      }
    })

    return documents
  }

  @Query(() => [Document])
  async getDocumentsByOrganizationSlug(
    @Arg("slug") slug: string,
  ): Promise <Document[]> {
    const organization = await Organization.findOne({
      where: {
        slug
      }
    });

    if(!organization) throw new Error("Organization not found");

    const documents = Document.find({
      where: {
        organization
      }
    })

    return documents
  }

  @FieldResolver()
  async versions(@Root() document: Document): Promise<DocumentVersion[]> {
    const documentVersions = await DocumentVersion.find({
      where: {
        document,
        published: true
      }
    })

    return documentVersions
  }
}
