import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { v4 as uuidV4 } from 'uuid'

import { getUserId } from '../utils'
import { TodoItem } from '../../models'
import { getDynamoDBClient } from '../../helpers/todosAcess'

const docClient = getDynamoDBClient("createTodo")
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorId = getUserId(event)
    const {name, dueDate} = JSON.parse(event.body)

    // TODO: validate dueDate and name e.g when empty strings are given (and yes, those pass through the request validator).
    const item: TodoItem = {
      authorId,
      todoId: uuidV4(),
      createdAt: new Date().toISOString(),
      name,
      dueDate,
      done: false,
    }
    await docClient.put({
      TableName: todosTable,
      Item: item,
    }).promise()

    return {
      statusCode: 201,
      body: JSON.stringify({ item })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
