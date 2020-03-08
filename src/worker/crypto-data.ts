import cp from 'coinpaprika-js'
import asyncForEach from 'async-await-foreach'
import { CryptoDataCoins } from "../entity/CryptoData";

export default class CryptoData {
  async saveCoins(coins) {
    await asyncForEach(coins, async (coin) => {
      const setter_string = Object.keys(coin).map(k => `"${k}" = :${k}`)

      const qb = CryptoDataCoins.createQueryBuilder()
      .insert()
      .values(coin)
      .onConflict(`(id) DO UPDATE SET ${setter_string}`)

      Object.keys(coin).forEach(k => {
        qb.setParameter(k, (coin as any)[k])
      })

      await qb.returning('*').execute();
    })
  }

  async start() {
    const coins = await cp.coins();

    await this.saveCoins(coins);
  }
}