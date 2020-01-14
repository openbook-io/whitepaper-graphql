import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class Pdf extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field()
  @Column()
  documentId: string;
}
