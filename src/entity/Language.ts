import { Entity, PrimaryGeneratedColumn, BaseEntity, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Language extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  nativeName: string;

  @Field()
  @Column()
  code: string;
  
  @Field()
  @Column({default: false})
  isFallback: boolean;
}
