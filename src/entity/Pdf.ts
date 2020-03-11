import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, Index } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { Document } from "./Document";
import { Language } from "./Language";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
@Index(["version", "document", "language"], { unique: true })
export class Pdf extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  version: string;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => Document)
  @ManyToOne(() => Document, {lazy: true})
  document: Lazy<Document>;

  @Field(() => Language)
  @ManyToOne(() => Language, {lazy: true})
  language: Lazy<Language>;
}
