import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne, BeforeInsert, BeforeUpdate, Index, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { PdfPage } from "./PdfPage";
import { Organization } from "./Organization";
import { Lazy } from '../helpers/Lazy';
import { config } from 'node-config-ts'

@ObjectType()
@Entity()
export class Pdf extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  @Index({ unique: true })
  documentId: string;

  @Field(() => String, { nullable: true })
  get documentUrl(): string {
    return `https://${config.documentUrl}/pdfs/${this.documentId}.pdf`
  }

  @Field(() => String, { nullable: true })
  get documentCoverUrl(): string {
    return `https://${config.documentUrl}/${this.documentId}/image1.jpg`
  }

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field(() => [PdfPage])
  @OneToMany(() => PdfPage, pdfPage => pdfPage.pdf, { lazy: true, cascade: true })
  pages: Lazy<PdfPage[]>;

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
