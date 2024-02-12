import { UserRaw } from './types';

export const objectTypeGuard = (item: unknown): item is object => {
  if (item === null) {
    return false;
  }

  if (typeof item !== 'object') {
    return false;
  }

  return true;
};

export const hasUsernameTypeGuard = (parentObject: object): parentObject is { username: string } => {
  if (!('username' in parentObject)) {
    return false;
  }

  if (typeof parentObject.username !== 'string') {
    return false;
  }

  return true;
};

export const hasAgeTypeGuard = (parentObject: object): parentObject is { age: number } => {
  if (!('age' in parentObject)) {
    return false;
  }

  if (typeof parentObject.age !== 'number') {
    return false;
  }

  if (parentObject.age < 0 || parentObject.age > 200) {
    return false;
  }

  return true;
};

export const hasHobbiesTypeGuard = (parentObject: object): parentObject is { hobbies: string[] } => {
  if (!('hobbies' in parentObject)) {
    return false;
  }
  if (!Array.isArray(parentObject.hobbies)) {
    return false;
  }
  if (!parentObject.hobbies.every(hobby => typeof hobby === 'string')) {
    return false;
  }

  return true;
};

const userTypeValidators = [hasUsernameTypeGuard, hasAgeTypeGuard, hasHobbiesTypeGuard] as const;

export const userRawTypeGuard = (item: unknown): item is UserRaw => {
  if (!objectTypeGuard(item)) {
    return false;
  }

  return userTypeValidators.every(validator => validator(item));
};

export const userRawTypeGuardPartial = (item: unknown): item is Partial<UserRaw> => {
  if (!objectTypeGuard(item)) {
    return false;
  }

  return userTypeValidators.some(validator => validator(item));
};

