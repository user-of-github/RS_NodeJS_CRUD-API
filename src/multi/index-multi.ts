import cluster from 'cluster';
import { runMasterProcess } from './masterProcess';
import { runWorkerProcess } from './workerProcesses';

const main = (): void => {
  if (cluster.isPrimary) {
    runMasterProcess();
  } if (cluster.isWorker) {
    runWorkerProcess();
  }
};

main();
