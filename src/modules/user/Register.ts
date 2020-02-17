import * as bcrypt from 'bcryptjs';
import { config } from 'node-config-ts'
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import * as jwt from 'jsonwebtoken'
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import { RegisterInput, IsUsernameValidInput } from "./register/InputTypess";
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(config.sendgrid.api_key);

@Resolver(Token)
export class RegisterResolver {
  @Mutation(() => Token)
  async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    username,
    password,
    newsletter
  }: RegisterInput): Promise<Token> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      newsletter,
      roles: ["user"]
    }).save();

    const verificationToken = jwt.sign({ email }, config.emailVerificationSecret);
    const token = jwt.sign({ id: user.id, roles: user.roles }, config.secret);

    const msg = {
      to: email,
      from: config.sendgrid.from,
      templateId: config.sendgrid.activate_template_id,
      dynamic_template_data: {
        firstName,
        lastName,
        verificationToken
      }
    };

    sendgrid.send(msg);

    return {token, user};
  }

  @Query(() => Boolean)
  async isUsernameValid(
    @Arg("data") { username }: IsUsernameValidInput
  ): Promise<Boolean> {
    if(username) {
      return true
    }

    return false
  }
}
