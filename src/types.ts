import { it } from 'node:test';

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

export const userRawTypeGuard = (item: unknown): item is UserRaw => {
  if (item === null) {
    return false;
  }
  if (typeof item !== 'object') {
    return false;
  }
  if (!('username' in item)) {
    return false;
  }
  if (typeof item.username !== 'string') {
    return false;
  }
  if (!('age' in item)) {
    return false;
  }
  if (typeof item.age !== 'number') {
    return false;
  }
  if (!('hobbies' in item)) {
    return false;
  }
  if (!Array.isArray(item.hobbies)) {
    return false;
  }
  if (!item.hobbies.every(hobby => typeof hobby === 'string')) {
    return false;
  }

  return true;
};
