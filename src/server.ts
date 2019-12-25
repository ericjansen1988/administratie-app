import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

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

/**
 * Module dependencies.
 */
import app from './app';
//TODO: const debug = require('debug')('backend:server');
import https from 'https';

/**
 * Create Server
 */
const options = {};
app.set('port', httpsPort);
const server = https.createServer(options, app);

/**
 * Event listener for HTTP server "error" event.
 */
type ListenError = {
    syscall: string;
    code: string;
};
function onError(error: ListenError): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof httpPort === 'string' ? 'Pipe ' + httpPort : 'Port ' + httpPort;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
server.listen(httpsPort);
server.on('error', onError);
server.on('listening', onListening);

//TODO: is dit nog nodig?
if (httpRedirect) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(req.header);
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

app.listen(httpPort);
