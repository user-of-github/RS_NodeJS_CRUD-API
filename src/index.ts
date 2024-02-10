import http from 'http';
import { createDatabase } from './database';
import { handleApiRequest } from './api';


const port = 8000;

const database = createDatabase();

const server = http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');

  const url = new URL(request.url || '');
  const pathname = url.pathname;
  await handleApiRequest(pathname, database, request, response);
});


server.listen(port);
