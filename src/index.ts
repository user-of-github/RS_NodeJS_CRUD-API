import http from 'http';
import dotenv from 'dotenv'
import { createDatabase } from './database';
import { handleApiRequest } from './api';
import { defaultPort } from './constants';

dotenv.config();

const port = process.env.PORT || defaultPort;

const database = createDatabase();

const server = http.createServer(async (request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', '*');

  await handleApiRequest(request.url, database, request, response);
});


server.listen(port);
console.log(`Server listening on port ${port}`);
