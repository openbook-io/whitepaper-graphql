import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Asset } from "./Asset";
import { User } from "./User";
import { UserOrganization } from "./UserOrganization";
import { Cryptocurrency } from "./Cryptocurrency";
import { OrganizationLink } from "./OrganizationLink";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class Organization extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Asset, { nullable: true })
  @ManyToOne(() => Asset, { lazy: true, nullable: true })
  picture?: Lazy<Asset> | null;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text", {unique: true})
  slug: string;

  @Field({nullable: true})
  @Column({nullable: true})
  about: string;

  @Field({nullable: true})
  @Column({nullable: true})
  website: string;

  @Field(() => [OrganizationLink])
  @OneToMany(() => OrganizationLink, organizationLink => organizationLink.organization, {
    cascade: true,
    lazy: true
  })
  links: Lazy<OrganizationLink[]>;

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  owner: Lazy<User>;

  @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization, {
    lazy: true
  })
  userOrganization: UserOrganization[];

  @Field(() => [Cryptocurrency])
  @OneToMany(() => Cryptocurrency, cryptocurrency => cryptocurrency.organization, {
    cascade: true,
    lazy: true
  })
  cryptocurrencies: Lazy<Cryptocurrency[]>;
}
