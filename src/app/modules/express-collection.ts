/* eslint-disable */
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const loggerMiddleware = (logger?: (text: string) => void) => (req: Request, resp: Response, next: NextFunction): void => {
    const text = 'Request logged: ' + req.method + ' ' + req.path;
    if(logger){
        logger(text);
    }else{
        console.log(text);
    }
    next();
};

export const create404Error = (req: Request, res: Response, next: NextFunction): void => {
    next(createError(404));
};

export const lowerCaseQueryParams = (req: Request, res: Response, next: NextFunction): void => {
    for (const key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
};

type cacheMiddlewareOptions = {
    userSpecific?: boolean;
    reqUserProperty?: string;
};

type cache = {
    get: (key: string, saveFunction?: () => void) => any;
    set: (key: string, data: any) => any;
};

export const cacheMiddleware = (cache: cache, options?: cacheMiddlewareOptions) => async (
    req: any,
    res: any,
    next: NextFunction,
): Promise<void | any> => {
    if (!options) {
        options = {};
    }
    let key = req.originalUrl || req.url;
    if (options.userSpecific && options.reqUserProperty){
        key = req[options.reqUserProperty] + '_' + key;
    } 
    const cachedata = await cache.get(key);
    if (cachedata) {
        return res.send(cachedata);
    } else {
        res.sendResponse = res.send;
        res.send = (body: any): any => {
            cache.set(key, body);
            res.sendResponse(body);
        };
        next();
    }
};

interface Error {
    message?: string;
    status?: number;
}

export const errorHandler = (err: Error, req: Request, res: Response): Response => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    const errormessage = err.message ? err.message : err;
    return res.json({ success: false, message: errormessage });
};

export const httpRedirect = (req: Request, res: Response, next: NextFunction): void => {
    console.log(req.header);
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
};

export const onListening = (server: any) => (): void  => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

type ListenError = {
    syscall: string;
    code: string;
};
export const onError = (port: string) => (error: ListenError): void => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(port + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

export const asyncHandler = (fn: any) => (...args: any) => {
  const fnReturn = fn(...args)
  const next = args[args.length-1]
  return Promise.resolve(fnReturn).catch(next)
}