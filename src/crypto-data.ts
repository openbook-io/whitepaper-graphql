import {createConnection} from 'typeorm';
import CryptoData from './worker/crypto-data';

const main = async () => {
  await createConnection();

  const cryptoData = new CryptoData();
  await cryptoData.start();
}

main();