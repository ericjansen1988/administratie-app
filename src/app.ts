import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import ApiDocumentation from './app/modules/swagger';
import swaggerUi from 'swagger-ui-express';

//TODO: import { oauthproviders } from './app/modules/application_cache';
//TODO: import OAuth from './app/modules/Oauth';
//TODO: import { bunq } from './app/modules/Bunq';

//Load firebase
import { db as firebaseDB } from './app/modules/Firebase';

/* Database configuratie */
//TODO: const db = require('./app/models');

// force: true will drop the table if it already exists
/*
const forceUpdate = process.env.NODE_ENV.toLowerCase() === 'test';
db.sequelize.sync({ force: forceUpdate }).then(async () => {
    console.log('Drop and Resync with { force: ' + forceUpdate + ' }');

    //laden van de BUNQ clients
    (async () => {
        //alle clients laden
        const allclients = await db.bunq.findAll();
        if (allclients.length === 0) return;
        //eerste client laden
        const client1 = allclients.shift();
        console.log('Eerste client laden', client1.userId);
        try {
            await bunq.load(
                client1.userId,
                client1.userId,
                client1.access_token,
                client1.encryption_key,
                client1.environment,
                {},
            );
            const requestLimiter = bunq.getClient(client1.userId).getBunqJSClient().ApiAdapter.RequestLimitFactory;
        } catch (err) {
            await client1.destroy();
            console.log('Error loading client ' + client1.userId);
        }

        //rest laden
        await Promise.all(
            allclients.map(async clientsetting => {
                console.log('loading client ' + clientsetting.userId);
                try {
                    await bunq.load(
                        clientsetting.userId,
                        clientsetting.userId,
                        clientsetting.access_token,
                        clientsetting.encryption_key,
                        clientsetting.environment,
                        {},
                    );
                    //await bunq.load(clientsetting.userId, clientsetting.data1, clientsetting.access_token, clientsetting.refresh_token, { environment: 'PRODUCTION', requestLimiter: requestLimiter });
                    console.log('client loaded ' + clientsetting.userId);
                } catch (err) {
                    await clientsetting.destroy();
                    console.log('Error loading client ' + clientsetting.userId);
                }
            }),
        );
    })();
});
*/

firebaseDB
    .collection('env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/oauthproviders')
    .get()
    .then((providers: any) => {
        providers.forEach((provider: any) => {
            const data = provider.data();
            console.log(provider.id + ': ', data);
            //const oauthprovider = new OAuth(data.client_id, data.client_secret, data);
            //oauthproviders[provider.id] = oauthprovider;
        });
    });
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../client/build')));

/* Express configuration */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
//First make all query params lowercase
app.use(function(req, res, next) {
    for (const key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});
app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200)); //certificate route

//Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(ApiDocumentation));

//TODO: require('./app/routes.js')(app);

// Use logger
app.use((req: Request, resp: Response, next: NextFunction) => {
    console.log('Request logged:', req.method, req.path);
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

interface Error {
    message?: string;
    status?: number;
}

// error handler
app.use(function(err: Error, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    //res.render('error');
    const errormessage = err.message ? err.message : err;
    return res.json({ success: false, message: errormessage });
});

export default app;
