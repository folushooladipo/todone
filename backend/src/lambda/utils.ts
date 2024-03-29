import { APIGatewayProxyEvent } from 'aws-lambda'
import { decode as decodeToken } from 'jsonwebtoken'

import { CustomJwtPayload } from '../auth/CustomJwtPayload'
import { TodoItem } from '../models'
import { XAWS } from '../utils/setupAWSXRay'

/**
 * @name getUserId
 * @description Get a user's ID from an API Gateway event. Does this by
 * parsing the auth token in the event's Authorization header.
 * @param {APIGatewayProxyEvent} event - an event from API Gateway.
 * @returns {string} - a user id from a JWT token.
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const tokenPayload = decodeToken(jwtToken) as CustomJwtPayload

  return tokenPayload.sub
}

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
/**
 * @name getTodoForUser
 * @description Retrieves a todo that was created by the specified user.
 * @param {string} userId - The ID of the user that created the todo.
 * @param {string} todoId - The ID of the todo.
 * @returns {TodoItem | undefined} - returns the todo if found. Else returns undefined.
 */
export const getTodoForUser = async (userId: string, todoId: string): Promise<TodoItem | undefined> => {
  const result = await docClient.get({
    TableName: todosTable,
    Key: {
      userId,
      todoId,
    }
  }).promise()
  
  return result.Item as TodoItem | undefined
}

/**
 * @name getAttachmentPathInS3
 * @description Constructs a path to which an attachment will be stored in AWS S3.
 * @param {string} userId - the ID of the user that created the todo that this attachment is for.
 * @param {string} todoId - the ID of the todo.
 * @param {string} fileName - a name for the file e.g example.jpg.
 * @returns {string} - a path in AWS S3 where the attachment will be stored.
 */
export const getAttachmentPathInS3 = (userId: string, todoId: string, fileName: string): string => {
  return `${userId}/${todoId}___${fileName}`
}
