import dotenv from 'dotenv';
import { httpRedirect as httpRedirectMiddleware, onListening, onError } from './app/modules/express-collection';
import winston from 'winston';

dotenv.config();

const NODE_ENV: string = (process.env.NODE_ENV || 'development').toLowerCase();

/**
 * Create logger
 */
const format = winston.format;
const customFormat = format.combine(
    format.label({ label: '[my-label]' }),
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(info => `[${info.timestamp}] - ${info.level}: ${info.message}`),
);
export const logging = winston.createLogger({
    level: 'info',
    format: customFormat,
    //defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'strderr.log', level: 'error' }),
        new winston.transports.File({ filename: 'stdout.log' }),
        new winston.transports.Console({
            format: customFormat,
        }),
    ],
});

logging.info('Starting application (environment: ' + NODE_ENV + ')');

import configs from './config/database';
const anyConfigs: any = configs;
const config: any = anyConfigs[NODE_ENV];
if (!config) {
    logging.error('No environment with name ' + NODE_ENV + ' found');
    throw 'No environment with name ' + NODE_ENV + ' found';
}

process.env.NODE_ENV = NODE_ENV;

const httpPort = process.env.PORT ?? 3001;
const httpsPort = process.env.HTTPS_PORT ?? 3002;
const httpRedirect = NODE_ENV === 'production' ? true : false;

logging.info('HTTP Poort: ' + httpPort);
logging.info('HTTPS Poort: ' + httpsPort);
logging.info('HTTP redirect: ' + httpRedirect);

import app from './app';
//TODO: const debug = require('debug')('backend:server');
import https from 'https';

app.set('port', httpsPort);
const server = https.createServer({}, app);

server.listen(httpsPort);
server.on('error', onError);
server.on('listening', onListening);

//TODO: is dit nog nodig?
if (httpRedirect) {
    app.use(httpRedirectMiddleware);
}

app.listen(httpPort);
