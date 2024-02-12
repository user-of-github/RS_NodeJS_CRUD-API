import os from 'os';
import http from 'http';
import cluster from 'cluster';
import dotenv from 'dotenv';
import { Worker as ClusterWorker } from 'cluster';
import { Database } from '../types';
import { createDatabase } from '../database';
import { defaultPort } from '../constants';
import { WorkerMessage } from './types';

export const runMasterProcess = () => {
  dotenv.config();
  const port = process.env.PORT ? Number(process.env.PORT) : defaultPort;

  let database: Database = createDatabase();

  const workers: ClusterWorker[] = [];
  const initialStringified = JSON.stringify(database); // to pass to just created workers

  const processesCount = os.cpus().length;
  for (let processNumber = 1; processNumber <= processesCount; ++processNumber) {
    const worker: ClusterWorker = cluster.fork({
      PORT: port + processNumber,
      initialDatabase: initialStringified
    });

    workers.push(worker);
  }

  for (const worker of workers) {
    worker.on('message', message => {
      if (message.type === 'updateDb') {
        console.info('MAIN: received new state from child worker');

        try {
          const parsed = JSON.parse(message.database);
          database = parsed;
          const messageWithUpdated: WorkerMessage = {
            type: 'updateDb', database: JSON.stringify(database)
          };

          workers.forEach(worker => worker.send(messageWithUpdated));
        } catch {
          console.error(`DB in ${port} was not updated`);
        }
      }
    });
  }

  let roundRobinCounter = 0;

  http.createServer((request, response) => {
    const processToRedirect = roundRobinCounter;

    roundRobinCounter = (roundRobinCounter + 1) % workers.length;

    response.writeHead(302, { location: `http://localhost:${port + processToRedirect}${request.url}` });
    response.end();
  }).listen(port, () => console.info(`Load balancer (primary) is running on port ${port} ...`));

  process.on('exit', () => {
    workers.forEach(worker => worker.kill());
  });
};
