import bcrypt from "bcryptjs";
import { config } from 'node-config-ts'
import { Arg, Mutation, Resolver } from "type-graphql";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import * as jwt from 'jsonwebtoken'
import { LoginInput, ForgotPasswordInput, ChangePasswordInput} from "./login/InputTypes";
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(config.sendgrid.api_key);

@Resolver()
export class LoginResolver {
  @Mutation(() => Token, { nullable: true })
  async login(
    @Arg("data")
    {
      usernameOrEmail,
      password
    }: LoginInput
  ): Promise<Token | null> {
    const user = await User.createQueryBuilder('user')
      .where("user.email = :usernameOrEmail", { usernameOrEmail })
      .orWhere("user.username = :usernameOrEmail", { usernameOrEmail })
      .getOne();

    if (!user) {
      throw new Error("Email or password is invalid");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Email or password is invalid");
    }

    const token = jwt.sign({ id: user.id, roles: user.roles }, config.secret);

    return {token, user};
  }

  @Mutation(() => Boolean)
  async sendRecoveryEmail(
    @Arg("data") { email }: ForgotPasswordInput
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true
    }

    const forgotPasswordToken = jwt.sign({ email }, config.forgotPasswordSecret);

    const msg = {
      to: email,
      from: config.sendgrid.from,
      templateId: config.sendgrid.forgot_password_template_id,
      dynamic_template_data: {
        forgotPasswordToken,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };

    sendgrid.send(msg);

    return true
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("data") { password, token }: ChangePasswordInput
  ): Promise<Boolean> {
    let payload: any = {}

    try {
      payload = await jwt.verify(token, config.forgotPasswordSecret)
    } catch (e) {
      return false;
    }

    const user = await User.findOne({
      where: {email: payload.email}
    });

    if(!user) {
      return false
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.save();

    return true
  }
}
