import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message} `;
});

const myLevels = {
  colors: {
    info: 'bold blue',
    warn: 'bold yellow',
    error: 'bold red',
  },
};

winston.addColors(myLevels.colors);

export const logger = winston.createLogger({
  level: 'warn',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        myFormat,
      ),
    }),
  );
}
