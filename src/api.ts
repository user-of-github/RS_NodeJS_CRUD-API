import { ServerResponse, IncomingMessage } from 'http';
import { v4, validate as validateUUID } from 'uuid';
import { Database } from './types';
import { StatusCode, usersEndpointBase, usersEndpointBaseWithSlash, userTypeDescriptionForError } from './constants';
import { extractParam, isPathNameWithParam, readBody } from './utils';
import { hasAgeTypeGuard, hasHobbiesTypeGuard, hasUsernameTypeGuard, userRawTypeGuard, userRawTypeGuardPartial } from './validators';


/**
Return type boolean - because modified it for start:multi to show when data is updated
 */
export const handleApiRequest = async (pathname: string, database: Database, request: IncomingMessage, response: ServerResponse): Promise<boolean> => {
  const { method } = request;

  try {
    switch (true) {
      case pathname === usersEndpointBase || pathname === usersEndpointBaseWithSlash: {
        switch (method) {
          case 'GET': {
            getAllUsers(database, response);
            return false;
          }
          case 'POST': {
            await createNewUser(database, request, response);
            return true;
          }
          default: {
            sendNotFound(response);
            return false;
          }
        }
        return false;
      }

      case isPathNameWithParam(pathname, usersEndpointBase): {
        switch (method) {
          case 'GET': {
            const param = extractParam(pathname, usersEndpointBase);
            getUser(param, database, response);
            return false;
          }
          case 'PUT': {
            const param = extractParam(pathname, usersEndpointBase);
            await updateUser(database, request, param, response);
            return true;
          }
          case 'DELETE': {
            const param = extractParam(pathname, usersEndpointBase);
            deleteUser(database, param, response);
            return true;
          }
          default: {
            sendNotFound(response);
            return false;
          }
        }
        return false;
      }

      default: {
        sendNotFound(response);
        return false;
      }
    }
  } catch (error) {
    response.statusCode = StatusCode.SERVER_ERROR;
    response.end(JSON.stringify({error:`Some error occurred on server. Error message: ${error}`}));
    return false;
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
    response.end(JSON.stringify({error:`Request body does not contain required fields. ${userTypeDescriptionForError}`}));
  } else {
    const newUser = {
      ...body, id: v4()
    };
    database.users.push(newUser);
    response.statusCode = StatusCode.OK_RESOURCE_CREATED;
    response.end(JSON.stringify(newUser));
  }
};

const updateUser = async (database: Database, request: IncomingMessage, userId: string, response: ServerResponse): Promise<void> => {
  if (!validateUUID(userId)) {
    response.statusCode = StatusCode.BAD_REQUEST;
    response.end(JSON.stringify({error:`Provided parameter userId ${userId} is invalid (not uuid)`}));
    return;
  }

  const currentUserIndex = database.users.findIndex(user => user.id === userId);

  if (currentUserIndex === -1) {
    response.statusCode = StatusCode.NOT_FOUND;
    response.end(JSON.stringify({error:`User with provided id ${userId} does not exist`}));
    return;
  }

  const body = await readBody(request);

  if (!userRawTypeGuardPartial(body)) {
    response.statusCode = StatusCode.BAD_REQUEST;
    response.end(JSON.stringify({error:`Provided object to update user should contain at least one of updated parameters with keys username, age, hobbies. ${userTypeDescriptionForError}`}));
    return;
  } else {
    if (hasUsernameTypeGuard(body)) {
      database.users[currentUserIndex].username = body.username;
    }

    if (hasAgeTypeGuard(body)) {
      database.users[currentUserIndex].age = body.age;
    }

    if (hasHobbiesTypeGuard(body)) {
      database.users[currentUserIndex].hobbies = body.hobbies;
    }

    response.statusCode = StatusCode.OK;
    response.end(JSON.stringify(database.users[currentUserIndex]));
  }
};

const sendNotFound = (response: ServerResponse) => {
  response.statusCode = StatusCode.NOT_FOUND;
  response.end(JSON.stringify({error: 'Endpoint (or request method for this endpoint) is not found'}));
};


const getUser = (userId: string, database: Database, response: ServerResponse): void => {
  if (!validateUUID(userId)) {
    response.statusCode = StatusCode.BAD_REQUEST;
    response.end(JSON.stringify({error: `Provided parameter userId ${userId} is invalid (not uuid)`}));
    return;
  }

  const user = database.users.find(user => user.id === userId);

  if (!user) {
    response.statusCode = StatusCode.NOT_FOUND;
    response.end(JSON.stringify({error: `User with provided id ${userId} does not exist` }));
    return;
  }

  response.statusCode = StatusCode.OK;
  response.end(JSON.stringify(user));
};

const deleteUser = (database: Database, userId: string, response: ServerResponse): void => {
  if (!validateUUID(userId)) {
    response.statusCode = StatusCode.BAD_REQUEST;
    response.end(JSON.stringify({error: `Provided parameter userId ${userId} is invalid (not uuid)`}));
  }

  const currentUserIndex = database.users.findIndex(user => user.id === userId);

  if (currentUserIndex === -1) {
    response.statusCode = StatusCode.NOT_FOUND;
    response.end(JSON.stringify({error:`User with provided id ${userId} does not exist`}));
    return;
  }


  database.users.splice(currentUserIndex, 1);

  response.statusCode = StatusCode.OK_RESOURCE_DELETED;
  response.end();
};
