import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { DynamoDB } from 'aws-sdk'

import { getUserId } from '../utils'
import { TodoItem, UpdateTodoRequestPayload } from '../../models'

const docClient = new DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const authorId = getUserId(event)
   const todoId = event.pathParameters.todoId
    const result = await docClient.get({
      TableName: todosTable,
      Key: {
        authorId,
        todoId,
      }
    }).promise()
    const savedTodo = result.Item as TodoItem | undefined

    if (!savedTodo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "You cannot update a todo that does not exist.",
        })
      }
    }

    const todoUpdate: UpdateTodoRequestPayload = JSON.parse(event.body)
    const todo: TodoItem = {
      ...savedTodo,
      ...todoUpdate,
    }
    await docClient.put({
      TableName: todosTable,
      Item: todo,
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ item: todo })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
