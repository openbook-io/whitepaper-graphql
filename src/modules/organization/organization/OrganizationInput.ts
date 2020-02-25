import { Length, IsUrl } from "class-validator";
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

@InputType()
export class OrganizationEditInput {
  @Field()
  @Length(2, 255, {message: "Name should be longer than 2 characters"})
  name: string;

  @Field({ nullable: true })
  @IsUrl(undefined, {message: "This is not an URL"})
  website: string;

  @Field({ nullable: true })
  about: string;

  @Field({ nullable: true })
  assetId?: string;
}
