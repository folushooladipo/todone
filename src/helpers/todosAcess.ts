import { DynamoDB } from 'aws-sdk'

import { createLogger } from '../utils/logger'

const logger = createLogger('TodosAccess')

export const getDynamoDBClient = (callerName: string): DynamoDB.DocumentClient => {
  logger.info("Creating DB client for:", callerName)
  return new DynamoDB.DocumentClient()
}
