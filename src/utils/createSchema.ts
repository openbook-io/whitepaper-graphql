import { useContainer } from 'typeorm';
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { RegisterResolver } from '../modules/user/Register';
import { LoginResolver } from "../modules/user/Login";
import { UserResolver } from "../modules/user/User";
import { AssetResolver } from "../modules/asset/Asset";
import { DocumentTypeResolver } from '../modules/document-type/DocumentType';
import { DocumentResolver } from '../modules/document/Document';
import { OrganizationResolver } from '../modules/organization/Organization';
import { CryptocurrencyResolver } from '../modules/cryptocurrency/Cryptocurrency';
import { SocialProviderResolver } from '../modules/social-provider/SocialProvider';
import { CryptoDataResolver } from '../modules/crypto-data/CryptoData';
import { PdfResolver } from '../modules/pdf/Pdf';
import { LanguageResolver } from '../modules/language/Language';
import { authChecker } from "../auth-checker";

useContainer(Container);

export const createSchema = () =>
  buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      UserResolver,
      DocumentTypeResolver,
      DocumentResolver,
      OrganizationResolver,
      CryptocurrencyResolver,
      AssetResolver,
      SocialProviderResolver,
      CryptoDataResolver,
      LanguageResolver,
      PdfResolver
    ],
    container: Container,
    authChecker
  });