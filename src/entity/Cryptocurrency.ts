import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { CryptoDataCoins } from "./CryptoData";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class Cryptocurrency extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  ticker: string;

  @Field()
  @Column({default: false})
  isOnExchange: boolean;

  @Field(() => CryptoDataCoins, {nullable: true})
  @ManyToOne(() => CryptoDataCoins, {lazy: true, nullable :true})
  cryptoDataCoin?: Lazy<CryptoDataCoins> | null;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  createdBy: Lazy<User>;
}
