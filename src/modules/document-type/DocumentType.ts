import { Resolver, Authorized, Mutation, Arg, Query } from 'type-graphql';
import { DocumentType } from "../../entity/DocumentType";

@Resolver()
export class DocumentTypeResolver {
  @Query(() => [DocumentType])
  async getDocumentTypes() : Promise<DocumentType[]> {
    const documentTypes = await DocumentType.find();

    return documentTypes;
  }

  @Authorized('admin')
  @Mutation(() => DocumentType)
  async addDocumentType(
    @Arg("name") name: string,
    @Arg("freeTextAllowed") freeTextAllowed: boolean,
  ) : Promise<DocumentType> {
    const documentType = new DocumentType();
    documentType.name = name;
    documentType.freeTextAllowed = freeTextAllowed;
    
    return documentType.save();
  }
}
