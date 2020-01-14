import { Entity, Column, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";
import { Organization } from "./Organization";

@ObjectType()
@Entity()
export class UserOrganization extends BaseEntity {
  @Field()
  @Column()
  isActive: boolean;

  @ManyToOne(() => User, user => user.userOrganization, { primary: true })
  user: User;

  @ManyToOne(() => Organization, organization => organization.userOrganization, { primary: true })
  organization: Organization;
}
