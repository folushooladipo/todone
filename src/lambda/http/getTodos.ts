import 'source-map-support/register'

import { DynamoDB } from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'

const docClient = new DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const { Items: todos } = await docClient.query({
      TableName: todosTable,
      IndexName: createdAtIndex,
      KeyConditionExpression: 'authorId = :authorId',
      ExpressionAttributeValues: {
        ':authorId': userId
      }
    }).promise()

    /*
    MY PLAN:
    - Implement pagination to this by default by extracting using limit = DEFAULT_LIMIT and pageNumber from the event's query params. Make sure you validate limit and pageNumber too? 
    - Should I add the ability to sort the results in different ways based on a sortOrder query param?
    - Use these files as a guide on how to query an index:
    -- /Users/folushooladipo/devdir/udacity/cloud-dev-nanodegree/chapter-4-serverless-apps/class-demos/10-udagram-app/src/lambda/http/getImages.ts
    -- For tips on validating nextKey and limit: class-demos/09-scan-pagination/index.js
    -- For how to use add a limit to the query, read the docs at this line: /Users/folushooladipo/devdir/udacity/cloud-dev-nanodegree/chapter-4-serverless-apps/class-demos/10-udagram-app/node_modules/aws-sdk/lib/dynamodb/document_client.d.ts:1484
    */

    return {
      statusCode: 200,
      body: JSON.stringify({ items: todos })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
