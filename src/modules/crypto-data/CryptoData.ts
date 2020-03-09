import { Resolver, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { CryptoDataCoins, CryptoDataHistorical } from "../../entity/CryptoData";
import cp from 'coinpaprika-js';
import moment from 'moment';

@Resolver(CryptoDataCoins)
export class CryptoDataResolver {
  @Query(() => [CryptoDataCoins])
  async searchCryptoDataCoins(
    @Arg("search") symbol: string,
  ): Promise <CryptoDataCoins[]> {
    const crypto = await CryptoDataCoins.find({
      where: `"symbol" ILIKE '${symbol}%'`, 
      take: 10
    })

    return crypto
  }

  @FieldResolver()
  async history(@Root() cryptoDataCoins: CryptoDataCoins): Promise<CryptoDataHistorical[]> {
    const startDate = moment().subtract(7,'d').format('YYYY-MM-DD');
    const historical = await cp.historical(cryptoDataCoins.id, startDate, {interval: '1h'});

    return historical;
  }
}
