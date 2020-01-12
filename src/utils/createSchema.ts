import { useContainer } from 'typeorm';
import { Container } from "typedi";
import { buildSchema } from "type-graphql";
import { RegisterResolver } from '../modules/user/Register';
import { LoginResolver } from "../modules/user/Login";
import { UserResolver } from "../modules/user/User";
import { authChecker } from "../auth-checker";

useContainer(Container);

export const createSchema = () =>
  buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      UserResolver
    ],
    container: Container,
    authChecker
  });