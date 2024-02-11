import request from 'supertest';
import { server } from '../src';
import { StatusCode, usersEndpointBase } from '../src/constants';
import dotenv from 'dotenv';
import { UserRaw } from '../src/types';
import { randomUUID } from 'node:crypto';
import { v4 } from 'uuid';


dotenv.config();


describe('#1 First scenario with usual flow', () => {
  afterAll(() => {
    server.close();
    server.closeIdleConnections();
    server.closeAllConnections();
  });

  const user: UserRaw = {username: 'First', age: 21, hobbies: ['Cooking']};
  const updateDataForUser: Pick<UserRaw, 'username'> = {username: 'First [Updated]'};
  const updatedUser: UserRaw = {...user, ...updateDataForUser};
  let userId: string;

  test('Initial server returns empty array', async () => {
    const data = await request(server).get(usersEndpointBase);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual([]);
  });

  test('Creates and returns user', async () => {
    const data = await request(server).post(usersEndpointBase).send(user);
    expect(data.statusCode).toBe(StatusCode.OK_RESOURCE_CREATED);
    userId = data.body.id;
    expect(data.body).toStrictEqual({...user, id: userId});
  });

  test('Returns this user by id', async () => {
    const data = await request(server).get(`${usersEndpointBase}/${userId}`);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual({...user, id: userId});
  });

  test('Returns all users properly', async () => {
    const data = await request(server).get(usersEndpointBase);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual([{...user, id: userId}]);
  });

  test('Updates this user by id', async () => {
    const data = await request(server).put(`${usersEndpointBase}/${userId}`).send(updateDataForUser);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual({...updatedUser, id: userId});
  });

  test('Returns all users properly after update', async () => {
    const data = await request(server).get(usersEndpointBase);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual([{...updatedUser, id: userId}]);
  });

  test('Removes user properly', async () => {
    const data = await request(server).delete(`${usersEndpointBase}/${userId}`);
    expect(data.statusCode).toBe(StatusCode.OK_RESOURCE_DELETED);
  });

  test('Returns all users properly after delete', async () => {
    const data = await request(server).get(usersEndpointBase);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual([]);
  });
});


describe('#2 Second scenario with testing more-cases (without validation)', () => {
  afterAll(() => {
    server.close();
    server.closeIdleConnections();
    server.closeAllConnections();
  });


  test('Initial returns empty', async () => {
    const data = await request(server).get(usersEndpointBase);
    expect(data.statusCode).toBe(StatusCode.OK);
    expect(data.body).toStrictEqual([]);
  });

  test('Returns NOT_FOUND when no user found', async () => {
    const uuid = v4();
    const data1 = await request(server).get(`${usersEndpointBase}/${uuid}`);
    expect(data1.statusCode).toBe(StatusCode.NOT_FOUND);
  });

  const user: UserRaw = {username: 'First', age: 21, hobbies: ['Cooking']};

  test('Returns NOT_FOUND after user deleted', async () => {
    const res1 = await request(server).post(usersEndpointBase).send(user);
    expect(res1.statusCode).toBe(StatusCode.OK_RESOURCE_CREATED);
    const userId = res1.body.id;

    const res2 = await request(server).get(`${usersEndpointBase}/${userId}`);
    expect(res2.body).toStrictEqual({...user, id: userId});
    expect(res2.statusCode).toStrictEqual(StatusCode.OK);

    const res3 = await request(server).delete(`${usersEndpointBase}/${userId}`);
    expect(res3.statusCode).toStrictEqual(StatusCode.OK_RESOURCE_DELETED);

    const res4 = await request(server).get(`${usersEndpointBase}/${userId}`);
    expect(res4.statusCode).toStrictEqual(StatusCode.NOT_FOUND);
  });
});

describe('#3 Third scenario with testing validation corner-cases', () => {
  afterAll(() => {
    server.close();
    server.closeIdleConnections();
    server.closeAllConnections();
  });

  const userInvalidData = [
    {username: 'First', age: 21, hobbies: ['Cooking', 42]},
    {username: 'First', age: 3332333, hobbies: ['Cooking']},
    {username: 'First', age: 21, hobbies: {}},
    {username: 'First', age: 21, hobbies: 42},

    {username: 'First', age: '21', hobbies: [] as unknown[]},
    {username: 'First', age: 21, hobbies: 42},
    {username: 2024},
    {username: {}, age: {}, hobbies: {}}
  ] as const;

  test.each(userInvalidData)('Returns 400 on create', async data => {
    const res = await request(server).post(usersEndpointBase).send(data);
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
  });

  const user: UserRaw = {username: 'First', age: 21, hobbies: ['Cooking']};
  let userId: string;

  test('Lets create user', async () => {
    const res = await request(server).post(usersEndpointBase).send(user);
    expect(res.statusCode).toBe(StatusCode.OK_RESOURCE_CREATED);
    userId = res.body.id;
  });

  const userInvalidData2 = [
    {username: {}, age: {}, hobbies: {}},
    {},
    {username: []},
    {age: '33'},
    { age: 3333 }
  ] as const;

  test.each(userInvalidData2)('Returns 400 on update', async data => {
    const res = await request(server).put(`${usersEndpointBase}/${userId}`).send(data);
    expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
  });
});

