import http from 'http';
import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import { defaultPort } from '../constants';
import { createDatabase } from '../database';
//
//
// const database = createDatabase();
//
//
// const runMainLoadBalancer = () => {
//   dotenv.config();
//   const port = process.env.PORT ? Number(process.env.PORT) : defaultPort;
//
//   for (let processNumber = 1; processNumber <= os.cpus().length; ++processNumber) {
//     cluster.fork({ PORT: port + processNumber});
//   }
//
//   let roundRobinCounter = 0;
//
//   http.createServer((request, response) => {
//     const worker = workers[roundRobinCounter];
//     roundRobinCounter = (roundRobinCounter + 1) % workers.length;
//
//     worker.send({ endpoint: request.url });
//
//     worker.on('message', (message) => {
//       response.setHeader('Content-Type', 'application/json');
//       response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//       response.setHeader('Access-Control-Allow-Origin', '*');
//       response.setHeader('Access-Control-Allow-Headers', '*');
//
//
//       response.writeHead(200);
//       response.end(message);
//     });
//   }).listen(port);
//
//   console.info(`Load balancer (primary) is running on port ${port} ...`);
// };
//
// if (cluster.isPrimary) {
//   runMainLoadBalancer();
// }
//
//
