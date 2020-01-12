import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Asset } from "./Asset";
import { UserLink } from "./UserLink";
import { Lazy } from '../helpers/Lazy';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Asset, { nullable: true })
  @OneToOne(() => Asset, { lazy: true, nullable: true })
  @JoinColumn()
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  website?: string

  @Field()
  @Column()
  name: string;

  @Column()
  password: string;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  roles: string[]

  @Field(() => [UserLink])
  @OneToMany(() => UserLink, userLink => userLink.user, {
    cascade: true,
    lazy: true
  })
  links: Lazy<UserLink[]>;

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
