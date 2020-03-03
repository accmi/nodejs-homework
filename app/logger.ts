import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'nodejs-homework' },
    transports: [
      new transports.Console({
          format: format.combine(
              format.colorize(),
              format.simple(),
          )
      })
    ]
  });
  