import { RelayNbOfItems } from 'auto-relay'
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType({ isAbstract: true })
export class BaseConnection {
  @Field(() => Int)
  public totalCount(
    @RelayNbOfItems() nbOfItem: number
  ): number {
    return nbOfItem;
  }
}