import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { SocialProvider } from "./SocialProvider";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class UserLink extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field()
  @Column()
  url: string;

  @Field(() => SocialProvider)
  @ManyToOne(() => SocialProvider, {lazy: true})
  socialProvider: Lazy<SocialProvider>;
}
