import { Field, InputType, ID } from "type-graphql";

@InputType()
export class CreateDocumentVersionInput {
  @Field()
  version: string;

  @Field()
  title: string;

  @Field({nullable: true})
  description?: string;

  @Field(() => ID)
  pdfId: number;

  @Field(() => ID)
  documentId: number;

  @Field(() => ID)
  languageId: number;
}