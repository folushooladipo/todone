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
    const userId = getUserId(event)
    const {name, dueDate} = JSON.parse(event.body)

    if (!name || !dueDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Neither the todo\'s name nor its due date can be empty.' })
      }
    }

    const item: TodoItem = {
      userId,
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
