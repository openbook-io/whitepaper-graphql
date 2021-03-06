import { Column, PrimaryGeneratedColumn, Entity, BaseEntity, ManyToOne, BeforeInsert } from "typeorm";
import { ObjectType, Field, ID  } from "type-graphql";
import { User } from './User';
import { Organization } from './Organization';
import { Lazy } from '../helpers/Lazy';
import { AssetType } from '../helpers/AssetType'

@ObjectType()
@Entity()
export class Asset extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  publicId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  version: number;

  @Field()
  @Column()
  type: AssetType

  @Field(() => User)
  @ManyToOne(() => User, {lazy: true})
  user: Lazy<User>;

  @Field(() => Organization, {nullable: true})
  @ManyToOne(() => Organization, {lazy: true, nullable: true})
  organization: Lazy<Organization>;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.createdAt = new Date();
  }
}