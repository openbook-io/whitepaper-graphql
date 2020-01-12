import { Length, IsUrl } from "class-validator";
import { Field, InputType, ID } from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  @Length(2, 255, {message: "First name should be longer than 2 characters"})
  firstName: string;

  @Field()
  @Length(2, 255, {message: "Last name should be longer than 2 characters"})
  lastName: string;

  @Field({ nullable: true })
  @Length(10, 400, {message: "Bio should be longer than 10 characters and less than 400"})
  bio?: string;

  @Field({ nullable: true })
  @IsUrl(undefined, {message: "This should be an URL"})
  website?: string;

  @Field({ nullable: true })
  assetId?: string;
}

@InputType()
export class UserSearchInput {
  @Field()
  @Length(2, 255, {message: "Name should be longer than 2 characters"})
  name: string;
}

@InputType()
export class UserLinkInput {
  @Field()
  @IsUrl(undefined, {message: "This should be an URL"})
  url: string;

  @Field(() => ID)
  socialProviderId: number;
}

@InputType()
export class UserEditLinkInput {
  @Field()
  @IsUrl(undefined, {message: "This should be an URL"})
  url: string;

  @Field(() => ID)
  id: number;
}