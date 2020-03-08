import { Resolver, Query, Mutation, Arg, Authorized, ID } from 'type-graphql';
import { Cryptocurrency } from "../../entity/Cryptocurrency";
import { User } from "../../entity/User";
import { Organization } from '../../entity/Organization';
import { CryptoDataCoins } from '../../entity/CryptoData';
import { IsMyOrganization } from '../../decorators/is-my-organization';
import { CurrentUser, CurrentOrganization } from "../../decorators/current";
import { CryptocurrencyEditInput, CryptocurrencyCreateInput } from './inputTypes';

@Resolver()
export class CryptocurrencyResolver {
  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Cryptocurrency)
  async createCryptocurrency(
    @Arg("data") { name, ticker, isOnExchange, coinDataId }: CryptocurrencyCreateInput,
    @CurrentUser() user: User,
    @CurrentOrganization() organization: Organization
  ): Promise<Cryptocurrency> {

    const cryptoDataCoin = coinDataId ? await CryptoDataCoins.findOne(coinDataId) : null

    const cryptocurrency = new Cryptocurrency();
    cryptocurrency.name = name;
    cryptocurrency.ticker = ticker;
    cryptocurrency.createdBy = user;
    cryptocurrency.organization = organization;
    cryptocurrency.isOnExchange = isOnExchange;
    cryptocurrency.cryptoDataCoin = cryptoDataCoin;

    return cryptocurrency.save();
  }

  @IsMyOrganization(['admin'])
  @Authorized('user')
  @Mutation(() => Cryptocurrency)
  async editCryptocurrency(
    @Arg("data") { name, ticker, isOnExchange, coinDataId, id }: CryptocurrencyEditInput
  ): Promise<Cryptocurrency> {
    const cryptocurrency = await Cryptocurrency.findOne(id);

    if(!cryptocurrency) throw new Error("Cryptocurrency not found");

    const cryptoDataCoin = coinDataId ? await CryptoDataCoins.findOne(coinDataId) : null
      
    cryptocurrency.name = name;
    cryptocurrency.ticker = ticker;
    cryptocurrency.isOnExchange = isOnExchange;
    cryptocurrency.cryptoDataCoin = cryptoDataCoin;

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
