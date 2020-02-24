import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import jwt from "express-jwt";
import {createConnection} from 'typeorm';
import { config } from 'node-config-ts';
import { TypeOrmConnection } from '@auto-relay/typeorm';
import { AutoRelayConfig } from 'auto-relay';
import { BaseConnection } from './utils/base-connection';
import { createSchema } from "./utils/createSchema";
import { queryUserAndOrganization } from './utils/queryUser';

new AutoRelayConfig({ orm: () => TypeOrmConnection,  extends: { connection: () => BaseConnection } })

const main = async () => {
  await createConnection();

  const path = "/graphql";

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    introspection: true,
    playground: true
  });

  const app = Express();

  app.use(
    path,
    jwt({
      secret: config.secret,
      credentialsRequired: false,
      requestProperty: 'auth'
    }),
    queryUserAndOrganization
  );

  apolloServer.applyMiddleware({app, path});

  app.listen(config.port, () => {
    console.log('server started')
  })
}

main();
