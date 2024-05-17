import { configure } from 'log4js';

configure({
  appenders: {
    console: {
      type: 'console',
    },
    errorFile: {
      type: 'dateFile',
      filename: '/',
      numBackups: 10,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: { appenders: ['console', 'errors'], level: 'debug' },
  },
});
