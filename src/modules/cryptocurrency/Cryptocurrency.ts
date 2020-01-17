import { Resolver, Mutation, Arg, Authorized } from 'type-graphql';
import { Cryptocurrency } from "../../entity/Cryptocurrency";
import { User } from "../../entity/User";
import { Organization } from '../../entity/Organization';
import { IsMyOrganization } from '../../decorators/is-my-organization';
import { CurrentUser, CurrentOrganization } from "../../decorators/current";

@Resolver()
export class CryptocurrencyResolver {
  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Cryptocurrency)
  async createCryptocurrency(
    @Arg("ticker") ticker: string,
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization
  ): Promise<Cryptocurrency> {
    const cryptocurrency = new Cryptocurrency();
    cryptocurrency.ticker = ticker;
    cryptocurrency.createdBy = user;
    cryptocurrency.organization = organization;

    return cryptocurrency.save();
  }
}
