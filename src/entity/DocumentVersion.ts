import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, Index, ManyToOne, OneToOne, BeforeInsert, BeforeUpdate, JoinColumn, AfterInsert, AfterRemove, AfterUpdate, RelationId } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { Document } from "./Document";
import { Language } from "./Language";
import { Pdf } from "./Pdf";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
@Index(["published", "document", "language"], { unique: true, where: '"published" IS NOT NULL' }) 
@Index(["version", "document", "language"], { unique: true })
export class DocumentVersion extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({nullable: true})
  @Column({nullable: true})
  description?: string;

  @Field()
  @Column()
  version: string;

  @Field({nullable: true})
  @Column({nullable: true})
  published: boolean;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field(() => Pdf, {nullable: true})
  @OneToOne(() => Pdf, {lazy: true, nullable: true})
  @JoinColumn()
  pdf: Lazy<Pdf>;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => Document)
  @ManyToOne(() => Document, {lazy: true})
  document: Lazy<Document>;

  @RelationId((document: DocumentVersion) => document.document) // you need to specify target relation
  documentId: number;

  @Field(() => Language)
  @ManyToOne(() => Language, {lazy: true})
  language: Lazy<Language>;

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

  @AfterInsert()
  @AfterRemove()
  @AfterUpdate()
  async checkRelationship() {
    const test = await Document
    .createQueryBuilder("document")
    .loadRelationCountAndMap("document.versionCount", "document.versions")
    .where("document.id = :id", { id: this.documentId })
    .getOne();

    console.log(test)
  }
}
