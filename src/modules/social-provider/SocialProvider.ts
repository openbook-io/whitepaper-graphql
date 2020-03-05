import {Resolver, Query} from 'type-graphql';

import { SocialProvider } from "../../entity/SocialProvider";

@Resolver()
export class SocialProviderResolver {
  @Query(() => [SocialProvider])
  async getSocialProviders():Promise<SocialProvider[]> {
    const socialProviders = await SocialProvider.find();

    return socialProviders;
  }
}
