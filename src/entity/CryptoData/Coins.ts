import { Entity, PrimaryColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { CryptoDataHistorical } from "./Historical";

@ObjectType()
@Entity()
export class CryptoDataCoins extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  symbol: string;

  @Field()
  @Column()
  is_new: boolean;

  @Field()
  @Column()
  is_active: boolean;

  @Field()
  @Column()
  rank: number;

  @Field()
  @Column()
  type: string;

  @Field(() => CryptoDataHistorical)
  history: CryptoDataHistorical[];
}
