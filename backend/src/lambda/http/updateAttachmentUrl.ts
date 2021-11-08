import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodoForUser, getUserId } from '../utils'
import { TodoItem } from '../../models'
import { getDynamoDBClient } from '../../helpers/todosAcess'

const docClient = getDynamoDBClient('updateTodo')
const todosTable = process.env.TODOS_TABLE
const attachmentsBucket = process.env.IMAGE_ATTACHMENTS_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { todoId } = JSON.parse(event.body)
    if (!todoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'You need to specify the ID of the todo you want to update.' })
      }
    }

    const userId = getUserId(event)
    const savedTodo = await getTodoForUser(userId, todoId)
    if (!savedTodo) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Attachment update failed: todo does not exist.'
        })
      }
    }

    const attachmentUrl = `https://${attachmentsBucket}.s3.amazonaws.com/${userId}/${todoId}`
    const todo: TodoItem = {
      ...savedTodo,
      attachmentUrl,
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
