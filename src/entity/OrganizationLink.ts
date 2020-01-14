import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Organization } from "./Organization";
import { SocialProvider } from "./SocialProvider";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class OrganizationLink extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Organization)
  @ManyToOne(() => Organization, {lazy: true})
  organization: Lazy<Organization>;

  @Field()
  @Column()
  url: string;

  @Field(() => SocialProvider)
  @ManyToOne(() => SocialProvider, {lazy: true})
  socialProvider: Lazy<SocialProvider>;
}
