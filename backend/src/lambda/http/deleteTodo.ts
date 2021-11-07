import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodoForUser, getUserId } from '../utils'
import { getDynamoDBClient } from '../../helpers/todosAcess'

const docClient = getDynamoDBClient('deleteTodo')
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const savedTodo = await getTodoForUser(authorId, todoId)
    if (!savedTodo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Deletion failed: todo does not exist.",
        })
      }
    }

    await docClient.delete({
      TableName: todosTable,
      Key: {
        authorId,
        todoId,
      },
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Todo deleted." })
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
