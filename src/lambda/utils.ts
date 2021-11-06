import { APIGatewayProxyEvent } from 'aws-lambda'
import { decode as decodeToken } from 'jsonwebtoken'

import { CustomJwtPayload } from '../auth/CustomJwtPayload'

/**
 * @name getUserId
 * @description Get a user's ID from an API Gateway event. Does this by
 * parsing the auth token in the event's Authorization header.
 * @param {APIGatewayProxyEvent} event - an event from API Gateway.
 * @returns {string} - a user id from a JWT token.
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const tokenPayload = decodeToken(jwtToken) as CustomJwtPayload

  return tokenPayload.sub
}
