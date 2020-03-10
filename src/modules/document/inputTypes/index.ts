import { Field, InputType, ID } from "type-graphql";

@InputType()
export class CreateDocumentInput {
  @Field({nullable: true})
  documentTypeText?: string;

  @Field(() => ID)
  documentTypeId: number;
}