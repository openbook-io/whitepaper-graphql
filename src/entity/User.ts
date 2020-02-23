import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert, BeforeUpdate, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Asset } from "./Asset";
import { UserLink } from "./UserLink";
import { Language } from './Language';
import { Lazy } from '../helpers/Lazy';
import { UserOrganization } from './UserOrganization';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Asset, { nullable: true })
  @ManyToOne(() => Asset, { lazy: true, nullable: true })
  avatar?: Lazy<Asset> | null;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio?: string

  @Field()
  @Column("text", {unique: true})
  email: string;

  @Field()
  @Column("text", {unique: true})
  username: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string

  @Field()
  @Column()
  name: string;

  @Column()
  password: string;

  @Field()
  @Column()
  newsletter: boolean;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  roles: string[]

  @Field(() => [UserLink])
  @OneToMany(() => UserLink, userLink => userLink.user, {
    cascade: true,
    lazy: true
  })
  links: Lazy<UserLink[]>;

  @Field(() => [UserOrganization])
  @OneToMany(() => UserOrganization, userOrganization => userOrganization.user, {lazy: true})
  userOrganization: Lazy<UserOrganization[]>;

  @Field(() => Language)
  @ManyToOne(() => Language, {lazy: true})
  defaultLanguage: Lazy<Language>;

  @Field()
  @Column()
  createdAt: Date;
  
  @Field({ nullable: true })
  @Column({ nullable: true })
  activatedAt: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
    this.name = `${this.firstName} ${this.lastName}`;
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = new Date();
    this.name = `${this.firstName} ${this.lastName}`;
  }
}
