import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { DocumentType } from "./DocumentType";
import { DocumentVersion } from "./DocumentVersion";
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

  @Field({nullable: true})
  @Column({nullable: true})
  typeText?: string;

  @Field(() => [DocumentVersion])
  versions: DocumentVersion[];
  
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
