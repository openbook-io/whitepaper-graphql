import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field()
  usernameOrEmail: string;

  @Field()
  @Length(5, 255, {message: "Password should be longer than 5 characters"})
  password: string;
}
