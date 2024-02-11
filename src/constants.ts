export const usersEndpointBase = '/api/users';

export const enum StatusCode {
  OK = 200,
  OK_RESOURCE_CREATED = 201,
  OK_RESOURCE_DELETED = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export const userTypeDescriptionForError = 'Values for keys should also satisfy requirements: { username: string, age: number, hobbies: string[]). Age must be in range 0..200';

export const defaultPort = 3000;
