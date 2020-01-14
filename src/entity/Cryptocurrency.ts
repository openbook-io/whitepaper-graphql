import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class Cryptocurrency extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  ticker: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  createdBy: Lazy<User>;
}
