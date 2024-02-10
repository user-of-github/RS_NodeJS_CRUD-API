import { ServerResponse, IncomingMessage } from 'http';
import { Database, userRawTypeGuard } from './types';
import { StatusCode, usersEndpointBase } from './constants';
import { isPathNameWithParam, readBody } from './utils';


export const handleApiRequest = async (pathname: string, database: Database, request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const { method } = request;

  switch (true) {
    case pathname === usersEndpointBase : {
      switch (method) {
        case 'GET': {
          getAllUsers(database, response);
          break;
        }
        case 'POST': {
          await createNewUser(database, request, response);
          break;
        }
        default: {
          break;
        }
      }
      break;
    }
    case isPathNameWithParam(pathname, usersEndpointBase): {
      switch (method) {
        case 'GET': {
          break;
        }
        case 'POST': {
          break;
        }
        default: {
          break;
        }
      }
      break;
    }
  }
};

const getAllUsers = (database: Database, response: ServerResponse): void => {
  response.statusCode = StatusCode.OK;
  response.end(JSON.stringify(database.users));
};

const createNewUser = async (database: Database, request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const body = await readBody(request);

  if (!userRawTypeGuard(body)) {
    response.statusCode = StatusCode.BAD_REQUEST;
    response.end('Request body does not contain required fields');
  }
};
