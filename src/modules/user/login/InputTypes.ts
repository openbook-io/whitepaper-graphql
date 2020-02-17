import { Length, IsEmail, IsJWT } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  @Length(5, 255, {message: "Password should be longer than 5 characters"})
  password: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail(undefined, {message: "Must be an email"})
  email: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @Length(5, 255, {message: "Password should be longer than 5 characters"})
  password: string;

  @Field()
  @IsJWT({message: "Token is not valid"})
  token: string;
}
