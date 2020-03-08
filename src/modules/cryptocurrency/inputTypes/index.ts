import { Length } from "class-validator";
import { Field, InputType, ID } from "type-graphql";

@InputType()
export class CryptocurrencyCreateInput {
  @Field()
  name: string;

  @Field()
  @Length(2, 6, {message: "Ticker should be between 2 to 6 characters"})
  ticker: string;

  @Field()
  isOnExchange: boolean;

  @Field(() => ID, {nullable: true})
  coinDataId: number;
}

@InputType()
export class CryptocurrencyEditInput extends CryptocurrencyCreateInput {
  @Field(() => ID)
  id: number;
}