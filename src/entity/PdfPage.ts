import { Entity, PrimaryGeneratedColumn, BaseEntity, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Pdf } from "./Pdf";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class PdfPage extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  number: number;

  @Field()
  @Column()
  key: string;

  @Field()
  @Column({ type: 'numeric' })
  width: number;

  @Field()
  @Column({ type: 'numeric' })
  height: number;

  @Field()
  @Column({ type: 'numeric' })
  scale: number;

  @Field(() => Pdf)
  @ManyToOne(() => Pdf, {lazy: true})
  pdf: Lazy<Pdf>;
}
