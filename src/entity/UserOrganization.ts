import { Entity, Column, BaseEntity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class UserOrganization extends BaseEntity {
  @PrimaryGeneratedColumn()
  UserOrganizationId!: number;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  roles: string[]

  @Field(() => User)
  @ManyToOne(() => User, user => user.userOrganization, { lazy: true, cascade: true })
  user: Lazy<User>;

  @Field(() => Organization)
  @ManyToOne(() => Organization, organization => organization.userOrganization, { lazy: true, cascade: true })
  organization: Lazy<Organization>;
}
