import { ServerResponse, IncomingMessage } from 'http';
import { v4 } from 'uuid';
import { Database, userRawTypeGuard } from './types';
import { StatusCode, usersEndpointBase } from './constants';
import { isPathNameWithParam, readBody } from './utils';


export const handleApiRequest = async (pathname: string, database: Database, request: IncomingMessage, response: ServerResponse): Promise<void> => {
  const { method } = request;
  console.log(pathname);

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
          sendNotFound(response);
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
          sendNotFound(response);
          break;
        }
      }
      break;
    }

    default: {
      sendNotFound(response);
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
  } else {
    const newUser = {
      ...body, id: v4()
    };
    database.users.push(newUser);
    response.statusCode = StatusCode.OK_RESOURCE_CREATED;
    response.end(JSON.stringify(newUser));
  }
};

const sendNotFound = (response: ServerResponse) => {
  response.statusCode = StatusCode.NOT_FOUND;
  response.end('Endpoint (or request method for this endpoint) is not found');
};
