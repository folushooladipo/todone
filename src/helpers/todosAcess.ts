import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../utils/logger'
import { XAWS } from '../utils/setupAWSXRay'

const logger = createLogger('TodosAccess')

export const getDynamoDBClient = (callerName: string): DocumentClient => {
  logger.info('Creating DB client for:', callerName)
  return new XAWS.DynamoDB.DocumentClient()
}
