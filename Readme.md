# RS School Node.js CRUD-API  
___  
## Launch manual  
- Node.js 20 required
- `npm install`  
- To run server: `npm start:dev`
- Test with Postman   
- You can also configure PORT in `.env` file
- To build: `npm run build`  
- To build and run built prod version: `npm run start:prod`  
- To run tests: `npm run test`  

___  
## API Manual:  
### `/api/users` or `/api/users/`:  
- __*GET*__: returns array of all users  
- __*POST*__: creates new user with __required data__:
  - `{username: string, age: number, hobbies: string[]}`  
  - __Important__: all data must be provided. All types must be as mentioned. 
Validators check it and will not allow to create user for example with hobbies: ['hobby1', 123], because all items in hobbies must be strings
- Any other method to this endpoint will lead to NOT_FOUND `404` server response
### `/api/users/<user_id>`: 
- For example `/api/users/8e4aeab6-0d84-490d-b423-831bc1a2ed23`  
- __*GET*__: Returns user object with provided ID  
  - If `<user_id>` is not UUID — then `400` BAD_REQUEST must be returned  
  - If user not found by id — then `404` NOT_FOUND must be returned
- __*PUT*__: Updates user. You should provide something like `Partial<User>`. It means that you can send as data to it `{"username": "New Name"}` — and only `username` will be updated. Or you can send `{"username": "New Name", "hobbies": ["New hobby"]}` - so 2 fields will be updated.
  - __Important__: Fields will be updated only if validation rules are applied.
  - For example if you send `{"username": 123}` - there will be no update.
  - Or if you send `{"username": "New Name", age: "NOT AN AGE"}` — only `username` will be updated
- __*DELETE*__: Deletes user and returns `204` status. If user not found - returns `404`. If provided uuid is not actual UUID - returns `400`

___  
### Used:  
- _**Language**: [TypeScript](https://www.typescriptlang.org/)_  
- _**Linting and formatting**: [ESLint](https://eslint.org/) with modern flat config and [ESLint.style](https://eslint.style/) for rules & formatting_
- _**Testing**: [Jest](https://jestjs.io/) and [SuperTest](https://www.npmjs.com/package/supertest) for testing API_
___  

###### Copyright 2024
###### Created by [@user-of-github](https://github.com/user-of-github)  
###### Inspired by Rolling Scopes and RS NodeJS 2024 Q1
