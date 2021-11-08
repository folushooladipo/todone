import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodoForUser, getUserId } from '../utils'
import { TodoItem, UpdateTodoRequestPayload } from '../../models'
import { getDynamoDBClient } from '../../helpers/todosAcess'

const docClient = getDynamoDBClient('updateTodo')
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const savedTodo = await getTodoForUser(userId, todoId)
    if (!savedTodo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "Update failed: todo does not exist.",
        })
      }
    }

    const {done, dueDate, name}: UpdateTodoRequestPayload = JSON.parse(event.body)
    const todo: TodoItem = {
      ...savedTodo,
      name,
      dueDate,
      done,
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
