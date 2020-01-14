import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { DocumentType } from "./DocumentType";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class Document extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => DocumentType)
  @ManyToOne(() => DocumentType, {lazy: true})
  type: Lazy<DocumentType>;

  @Field()
  @Column()
  typeText: string;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  createdBy: Lazy<User>;

  @Field()
  @Column()
  createdAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
  }
}
