import http from 'http';
import { Database } from '../types';
import { UpdateDatabaseMessage, WorkerMessage } from './types';
import { handleApiRequest } from '../api';

export const runWorkerProcess = () => {
  const port = Number(process.env.PORT);
  let database: Database = JSON.parse(process.env.initialDatabase);

  process.on('message', (message: WorkerMessage) => {
    if (message.type === 'updateDb') {
      try {
        const parsed = JSON.parse(message.database);
        database = parsed;
      } catch {
        console.error(`DB in ${port} was not updated`);
      }
    }
  });

  const updateMasterDataBase = () => {
    const message: UpdateDatabaseMessage = {
      database: JSON.stringify(database),
      type: 'updateDb'
    };
    process.send(message);
  };

  http.createServer(async (request, response) => {
    const wasDbModified = await handleApiRequest(request.url, database, request, response);

    if (wasDbModified) {
      updateMasterDataBase();
    }
  }).listen(port, () => console.info(`Server (one of child processes) is listening on port ${process.env.PORT} ...`));
};
