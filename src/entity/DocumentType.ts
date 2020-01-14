import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class DocumentType extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
  
  @Field()
  @Column()
  freeTextAllowed: boolean;
}
