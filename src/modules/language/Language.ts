import { Resolver, Authorized, Query } from 'type-graphql';
import { Language } from "../../entity/Language";

@Resolver()
export class LanguageResolver {
  @Authorized('user')
  @Query(() => [Language])
  async getLanguages() : Promise<Language[]> {
    const languages = await Language.find();
    
    return languages;
  }
}
