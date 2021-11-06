import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { deleteTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    /* MY PLAN:
    - Try to fetch the todo. If not found, return a 404 saying "Error. Cannot delete a todo that has does not exist."
    - If it was found BUT the user making the request wasn't the one that created it, return a 403 saying "Error. You cannot delete this todo."
    - Else, delete the todo and return { message: `Todo deleted successfully.` }.
    */
   // TODO: does deleting an item in an index delete the item in the main table?

    return {
      statusCode: 200,
      body: JSON.stringify(event)
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
