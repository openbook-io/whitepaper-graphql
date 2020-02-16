import bcrypt from "bcryptjs";
import { config } from 'node-config-ts'
import { Arg, Mutation, Resolver } from "type-graphql";
import { Token } from "../../entity/Token";
import { User } from "../../entity/User";
import * as jwt from 'jsonwebtoken'
import { LoginInput } from "./login/LoginInput";

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
}
