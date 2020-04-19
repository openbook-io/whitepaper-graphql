import {createConnection} from 'typeorm';
import worker from './worker/worker';

(async () => {
  await createConnection();

  worker();
})();