import { Length, IsEmail, Matches, IsBoolean } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";
import { IsUsernameAlreadyExist } from "./isUsernameAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 255, {message: "First name should be longer than 2 characters"})
  firstName: string;

  @Field()
  @Length(2, 255, {message: "Last name should be longer than 2 characters"})
  lastName: string;

  @Field()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {message: "Username not valid"})
  @IsUsernameAlreadyExist({ message: "Username already in use" })
  username: string;

  @Field()
  @IsEmail(undefined, {message: "Must be an email"})
  @IsEmailAlreadyExist({ message: "Email already in use" })
  email: string;

  @Field()
  @Length(5, 255, {message: "Password should be longer than 2 characters"})
  password: string;

  @Field()
  @IsBoolean({message: "Newsletter should be true or false"})
  newsletter: boolean;
}

@InputType()
export class IsUsernameValidInput {
  @Field()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {message: "Username not valid"})
  @IsUsernameAlreadyExist({ message: "Username already in use" })
  username: string;
}
