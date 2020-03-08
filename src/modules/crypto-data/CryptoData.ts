import { Resolver, Arg, Query } from 'type-graphql';
import { CryptoDataCoins } from "../../entity/CryptoData";

@Resolver()
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
}
