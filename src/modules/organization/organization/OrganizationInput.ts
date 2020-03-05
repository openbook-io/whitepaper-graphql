import { Length, IsUrl } from "class-validator";
import { Field, InputType, ID } from "type-graphql";
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

@InputType()
export class OrganizationLinkInput {
  @Field()
  @IsUrl(undefined, {message: "This should be an URL"})
  url: string;

  @Field(() => ID)
  socialProviderId: number;
}

@InputType()
export class OrganizationEditLinkInput {
  @Field()
  @IsUrl(undefined, {message: "This should be an URL"})
  url: string;

  @Field(() => ID)
  id: number;
}