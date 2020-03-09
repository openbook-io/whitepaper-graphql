import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class CryptoDataHistorical {
  @Field()
  timestamp: string;

  @Field()
  price: number;

  @Field()
  volume_24h: number;

  @Field()
  market_cap: number;
}
