import { Resolver, Query, Ctx, Authorized, Mutation, Arg, ID } from 'type-graphql';
import { Context } from "../../interface/Context";
import { User } from "../../entity/User";
import { Language } from "../../entity/Language";
import { UserLink } from "../../entity/UserLink";
import { SocialProvider } from "../../entity/SocialProvider";
import { UserInput, UserSearchInput, UserLinkInput, UserEditLinkInput } from "./user/UserInput";
import { Asset } from "../../entity/Asset";
import * as jwt from 'jsonwebtoken'
import { config } from 'node-config-ts'
import { CurrentUser } from "../../decorators/current";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getUsers():Promise<User[]> {
    const users = await User.find({
      where: {
        visible: true
      }
    });

    return users;
  }

  @Query(() => [User])
  async userSearch(
    @Arg('data') { name }: UserSearchInput,
  ): Promise<User[]> {
    const user = await User.find({
      where: `"name" ILIKE '${name}%'`, 
      take: 10
    });

    return user
  }

  @Query(() => User, { nullable: true })
  async me(
    @Ctx() ctx: Context
  ): Promise<User | null> {
    if(!ctx.req.user) return null

    const user = await User.findOne(ctx.req.user.id);

    return user!
  }

  @Authorized('user')
  @Mutation(() => User)
  async updateMe(
    @Arg("data") { firstName, lastName, bio, assetId, website }: UserInput,
    @CurrentUser() user: User
  ): Promise<User> {
    const asset = assetId ? await Asset.findOne(assetId) : null;
    if(assetId && !asset) throw new Error("Asset not found");

    user.firstName = firstName;
    user.lastName = lastName;
    user.bio = bio;
    user.avatar = asset;
    user.website = website;
    user.save();

    return user;
  }

  @Authorized('user')
  @Mutation(() => User)
  async setMyDefaultLanguage(
    @Arg("languageId", () => ID) languageId: number,
    @CurrentUser() user: User
  ): Promise<User> {
    const language = await Language.findOne(languageId);
    if(!language) throw new Error("Language not found");

    user.defaultLanguage = language;
    user.save();

    return user;
  }

  @Authorized('user')
  @Mutation(() => UserLink)
  async addUserLink(
    @Arg("data") { url, socialProviderId }: UserLinkInput,
    @Ctx() ctx: Context
  ): Promise<UserLink> {
    const socialProvider = await SocialProvider.findOne(socialProviderId);
    if(!socialProvider) throw new Error("Social provider not found");

    const userLink = new UserLink();

    userLink.url = url;
    userLink.socialProvider = socialProvider;
    userLink.user = ctx.req.user!;
    const newUserLink = userLink.save();

    return newUserLink;
  }

  @Authorized('user')
  @Mutation(() => UserLink)
  async editUserLink(
    @Arg("data") { url, id }: UserEditLinkInput,
    @Ctx() ctx: Context
  ): Promise<UserLink> {
    const userLink = await UserLink.findOne({where: {
      id: id,
      user: ctx.req.user
    }});
    if(!userLink) throw new Error("User link not found");

    userLink.url = url;
    const newUserLink = userLink.save();

    return newUserLink;
  }

  @Authorized('user')
  @Mutation(() => Boolean)
  async deleteUserLink(
    @Arg("id", () => ID) id: number,
    @Ctx() ctx: Context
  ) : Promise<Boolean> {
    await UserLink.delete({
      id: id,
      user: ctx.req.user!
    });

    return true;
  }

  @Mutation(() => Boolean)
  async verifyUser(
    @Arg("token") token: string,
  ) : Promise<Boolean> {
    let payload: any = {}

    try {
      payload = await jwt.verify(token, config.emailVerificationSecret)
    } catch (e) {
      return false;
    }

    const user = await User.findOne({
      where: {email: payload.email}
    });

    if(!user) return false;
    if(user.activatedAt) return true;
    
    user.activatedAt = new Date();
    await user.save()

    return true;
  }
}
