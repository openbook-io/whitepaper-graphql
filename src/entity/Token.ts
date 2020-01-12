import { ObjectType, Field} from "type-graphql";
import { User } from './User';

@ObjectType()
export class Token {
  @Field()
  token: string;

  @Field()
  user: User;
}
