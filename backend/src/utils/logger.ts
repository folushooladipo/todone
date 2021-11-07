import * as winston from 'winston'

/**
 * @name createLogger
 * @description Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 * @returns {winston.Logger} - returns a logger
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [
      new winston.transports.Console()
    ]
  })
}
