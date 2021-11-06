import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { updateTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const todoId = event.pathParameters.todoId
    // const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    /* MY PLAN:
    - Try to fetch the todo. If not found, return a 404 saying "Error. Cannot update a todo that has not been created yet."
    - If it was found BUT the user making the request wasn't the one that created it, return a 403 saying "Error. You cannot update this todo."
    - Else, update the todo and return the updated result.
    */

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
