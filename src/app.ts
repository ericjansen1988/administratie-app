import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { lowerCaseQueryParams, logger as LoggerMiddleware, create404Error, errorHandler } from 'express-collection';
import Bunq from './app/modules/Bunq';

import db from './app/models';

/**
 * Application cache
 */
import set from 'set-value';
import get from 'get-value';
export const appData: any = {};
export const setAppData = (key: string, value: any): void => {
    set(appData, key, value);
};
export const getAppData = (key: string): any => {
    return get(appData, key);
};

//Load firebase
import { db as firebaseDB } from './app/modules/Firebase';

/* Database configuratie */
// force: true will drop the table if it already exists
const forceUpdate = process.env.NODE_ENV === 'test' ? true : false;
db.sequelize.sync({ force: forceUpdate }).then(async () => {
    console.log('Drop and Resync with { force: ' + forceUpdate + ' }');

    /**
     * Bunq clients laden
     * inclusief genericClient
     */
    const bunq = new Bunq(path.resolve(__dirname, './config/bunq'));
    // Generieke client starten
    bunq.loadGenericClient();

    //laden van de BUNQ clients
    (async (): Promise<void> => {
        //alle clients laden
        const allclients = await db.bunq.findAll();
        if (allclients.length === 0) return;
        //eerste client laden
        const client1 = allclients.shift();
        console.log('Eerste client laden', client1.userId);
        try {
            await bunq.load(client1.userId, client1.access_token, client1.encryption_key, client1.environment, {});
            //const requestLimiter = bunq.getClient(client1.userId).getBunqJSClient().ApiAdapter.RequestLimitFactory;
        } catch (err) {
            await client1.destroy();
            console.log('Error loading client ' + client1.userId);
        }

        //rest laden
        await Promise.all(
            allclients.map(async (clientsetting: any) => {
                console.log('loading client ' + clientsetting.userId);
                try {
                    await bunq.load(
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
    setAppData('bunq', bunq);
});

// import Oauth module and load into cache
import OAuth from './app/modules/Oauth';
firebaseDB
    .collection('env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/oauthproviders')
    .get()
    // eslint-disable-next-line
    .then((providers: any) => {
        setAppData('oauth', {});
        // eslint-disable-next-line
        providers.forEach((provider: any) => {
            const data = provider.data();
            console.log(provider.id + ': ', data);
            const oauthprovider = new OAuth(data);
            setAppData('oauth.' + provider.id, oauthprovider);
        });
    });
const app = express();
export default app;

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
app.use(lowerCaseQueryParams); // Makes all query params lowercase
app.use(LoggerMiddleware); //Logs requests on console

app.get('/health-check', (req: Request, res: Response) => res.sendStatus(200)); //certificate route & simple health check

import './app/routes';

app.use(create404Error); //If route isnt found throw 404
app.use(errorHandler); // If error throw Error object
