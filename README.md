## About
My name is Folusho Oladipo and this is my submission for Chapter 4 of the Udacity Cloud Developer nanodegree.

### Tl;dr
- You have to use [Yarn](https://yarnpkg.com/) and not npm to install this project's dependencies (both for the client app and the serverless backend).
- I have added a custom Postman collection with which you can test the backend's endpoints. You can find it in `Cloud Developer C4 Project - Folusho Oladipo.postman_collection.json`.
- I implemented authentication first and thus decided to create a composite key by using userId as my partition key and todoId as my sort key. Then I went on to create a local secondary index using createdAt, and that index is (so far) only read when getting all of a user's todos.
- My choices about the parts of my composite key rendered the `backend/src/helpers/todos.ts` file obsolete, so I deleted it.
- Unlike I did for `backend/src/lambda/http/updateTodo.ts` and `backend/src/lambda/http/deleteTodo.ts`, I didn't check for a todo's existence before generating an upload URL for its attachment in `backend/src/lambda/http/generateUploadUrl.ts`. This was because I decided that it would be cheaper and more secure to restrict where the attachments bucket accepted uploads from than to be querying the database every time someone asks for an upload URL.
