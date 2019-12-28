import dotenv from 'dotenv';
import { httpRedirect as httpRedirectMiddleware, onListening, onError } from 'express-collection';

dotenv.config();

const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();

console.log('Starting env ' + NODE_ENV);
import configs from '../config/database/config';
const config = configs[NODE_ENV];
if (!config) {
    throw 'No environment with name ' + NODE_ENV + ' found';
}

process.env.NODE_ENV = NODE_ENV;

const httpPort = process.env.PORT ?? 3001;
const httpsPort = process.env.HTTPS_PORT ?? 3002;
const httpRedirect = NODE_ENV === 'production' ? true : false;

console.log('HTTP Poort: ' + httpPort);
console.log('HTTPS Poort: ' + httpsPort);
console.log('HTTP redirect: ' + httpRedirect);

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
