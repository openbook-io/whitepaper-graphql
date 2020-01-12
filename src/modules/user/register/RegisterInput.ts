import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(2, 255, {message: "First name should be longer than 2 characters"})
  firstName: string;

  @Field()
  @Length(2, 255, {message: "Last name should be longer than 2 characters"})
  lastName: string;

  @Field()
  @IsEmail(undefined, {message: "Must be an email"})
  @IsEmailAlreadyExist({ message: "Email already in use" })
  email: string;

  @Field()
  @Length(5, 255, {message: "Password should be longer than 2 characters"})
  password: string;
}
