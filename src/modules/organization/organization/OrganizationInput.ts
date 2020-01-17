import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsSlugAlreadyExist } from "./isSlugAlreadyExist";

@InputType()
export class OrganizationInput {
  @Field()
  @Length(2, 255, {message: "Name should be longer than 2 characters"})
  name: string;

  @Field()
  @IsSlugAlreadyExist({ message: "Slug already in use" })
  slug: string;
}
