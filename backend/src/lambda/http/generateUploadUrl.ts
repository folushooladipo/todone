import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUploadURLForAttachment } from '../../helpers/attachmentUtils'
import { createLogger } from '../../utils/logger'
import { getAttachmentPathInS3, getUserId } from '../utils'

const {
  SIGNED_URL_EXPIRATION_IN_SECONDS: stringifiedUrlExpiration,
} = process.env

const urlExpiration = parseInt(stringifiedUrlExpiration, 10)
const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let uploadUrl: string
    try {
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const fileName: string = JSON.parse(event.body).fileName
      const attachmentPath = getAttachmentPathInS3(userId, todoId, fileName)
      uploadUrl = getUploadURLForAttachment(attachmentPath, urlExpiration)
    } catch (err) {
      logger.error('Failed to generate signed URL because of this error:', err)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to generate signed URL.' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl })
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
