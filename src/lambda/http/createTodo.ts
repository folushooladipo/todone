import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { DynamoDB } from 'aws-sdk'
import { v4 as uuidV4 } from 'uuid'

import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

const docClient = new DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authorId = getUserId(event)
    const {name, dueDate} = JSON.parse(event.body)

    // TODO: validate dueDate.
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
