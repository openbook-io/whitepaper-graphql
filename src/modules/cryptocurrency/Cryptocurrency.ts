import { Resolver, Query, Mutation, Arg, Authorized, ID } from 'type-graphql';
import { Cryptocurrency } from "../../entity/Cryptocurrency";
import { User } from "../../entity/User";
import { Organization } from '../../entity/Organization';
import { IsMyOrganization } from '../../decorators/is-my-organization';
import { CurrentUser, CurrentOrganization } from "../../decorators/current";
import { CryptocurrencyEditInput, CryptocurrencyCreateInput } from './inputTypes';

@Resolver()
export class CryptocurrencyResolver {
  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Cryptocurrency)
  async createCryptocurrency(
    @Arg("data") { name, ticker }: CryptocurrencyCreateInput,
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization
  ): Promise<Cryptocurrency> {
    const cryptocurrency = new Cryptocurrency();
    cryptocurrency.name = name;
    cryptocurrency.ticker = ticker;
    cryptocurrency.createdBy = user;
    cryptocurrency.organization = organization;

    return cryptocurrency.save();
  }

  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Cryptocurrency)
  async editCryptocurrency(
    @Arg("data") { name, ticker, id }: CryptocurrencyEditInput
  ): Promise<Cryptocurrency> {
    const cryptocurrency = await Cryptocurrency.findOne(id);

    if(!cryptocurrency) throw new Error("Cryptocurrency not found");

    cryptocurrency.name = name;
    cryptocurrency.ticker = ticker;

    return cryptocurrency.save();
  }

  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Boolean)
  async removeCryptocurrency(
    @Arg("id", () => ID) id: number,
    @CurrentOrganization() organization: Organization
  ): Promise<boolean> {
    const result = await Cryptocurrency.delete({ 
      id,
      organization
    });

    if(result.affected) return true
    
    return false;
  }

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => [Cryptocurrency])
  async myCryptocurrencies(
    @CurrentOrganization() organization: Organization
  ): Promise <Cryptocurrency[]> {
    const cryptocurrencies = Cryptocurrency.find({
      where: {
        organization
      }
    })

    return cryptocurrencies
  }

  @IsMyOrganization()
  @Authorized('user')
  @Query(() => Cryptocurrency)
  async myCryptocurrency(
    @Arg("id", () => ID) id: number,
    @CurrentOrganization() organization: Organization
  ): Promise <Cryptocurrency> {
    const crypto = await Cryptocurrency.findOne({
      id,
      organization
    })

    if(!crypto) throw new Error("Cryptocurrency not found");

    return crypto
  }
}
