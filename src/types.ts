export interface UserRaw {
  username: string;
  age: number;
  hobbies: string[];
}

export interface User extends UserRaw {
  id: string;
}

export interface Database {
  users: User[];
}

export type RequestMethod = string | undefined;


