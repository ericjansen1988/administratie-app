import express, { Request, Response } from 'express';
const router = express.Router();

import { basicAuthentication } from '../middleware/authentication';
import { asyncHandler } from 'express-collection';

import Encryption from 'simple-encrypt-js';

import { bunq } from '../modules/Bunq';
import db from '../models';

const encryption = new Encryption();

type BunqEnvironment = 'PRODUCTION' | 'SANDBOX';

interface CustomRequest extends Request {
    uid?: string;
}

const saveBunqSettings = async (
    user: number,
    authorizationCode: string,
    encryptionKey: string,
    environment: BunqEnvironment = 'PRODUCTION',
): Promise<any> => {
    const conditions = { where: { userId: user } };
    const body = {
        userId: user,
        access_token: authorizationCode, //eslint-disable-line
        encryption_key: encryptionKey, //eslint-disable-line
        environment: environment,
    };
    let entry = await db.bunq.findOne(conditions);
    if (entry) {
        entry = await entry.update(body);
    } else {
        entry = await db.bunq.create(body);
    }
    return entry;
};

const exchangeOAuthTokens = async (req: CustomRequest, res: Response): Promise<Response> => {
    if (req.body.code === null) {
        return res.send('Geen auth code meegegeven');
    } else {
        try {
            const bunqoauth = oauthproviders['bunq'];
            const authorizationCode = await bunq
                .getGenericClient()
                .exchangeOAuthToken(
                    bunqoauth.options.client_id,
                    bunqoauth.options.client_secret,
                    bunqoauth.options.redirect_url,
                    req.body.code,
                );
            console.log(authorizationCode);
            const entry = await saveBunqSettings(
                req.uid,
                authorizationCode,
                encryption.generateRandomKey(32),
                'PRODUCTION',
            );
            await bunq.load(req.uid, req.uid, authorizationCode, entry.encryption_key, 'PRODUCTION', {});
            return res.send({ success: true });
        } catch (error) {
            console.log(error);
            return res.send({ success: false, message: error.response.data.error_description });
        }
    }
};

const doRequestSandboxMoney = async (uid: string) => {
    const client = bunq.getClient(uid);
    if (client.environment !== 'SANDBOX')
        throw new Error(
            'You can only request money on a sandbox environment. Bunq environment is: ' + client.environment,
        );
    const accounts = await client.getAccounts();
    await client.createRequestInquiry(
        { type: 'id', value: accounts[0].id },
        'Gimme money',
        { value: '500', currency: 'EUR' },
        {
            type: 'EMAIL',
            value: 'sugardaddy@bunq.com',
            name: 'Sugar Daddy',
        },
    );
    await client.createRequestInquiry(
        { type: 'id', value: accounts[0].id },
        'Gimme money',
        { value: '500', currency: 'EUR' },
        {
            type: 'EMAIL',
            value: 'sugardaddy@bunq.com',
            name: 'Sugar Daddy',
        },
    );
    await client.createRequestInquiry(
        { type: 'id', value: accounts[0].id },
        'Gimme money',
        { value: '500', currency: 'EUR' },
        {
            type: 'EMAIL',
            value: 'sugardaddy@bunq.com',
            name: 'Sugar Daddy',
        },
    );
};

const createSandboxAPIKey = async (req: CustomRequest, res: Response): Promise<Response> => {
    const key = await bunq.getGenericClient().api.sandboxUser.post();
    const userentry = await saveBunqSettings(req.uid, key, encryption.generateRandomKey(32), 'SANDBOX');
    //console.log(userentry);
    await bunq.load(req.uid, req.uid, key, userentry.encryption_key, 'SANDBOX');
    const client = bunq.getClient(req.uid);
    const users = await client.getUser();
    try {
        await doRequestSandboxMoney(req.uid);
    } catch (err) {
        return res.status(400).send({ success: false, message: err });
    }
    const accounts = await client.getAccounts();
    await client
        .getBunqJSClient()
        .api.monetaryAccountBank.put(client.getUser().id, accounts[0].id, { description: 'Algemeen' });
    await client.createAccount('Spaarrekening');
    await client.createAccount('Afschrijvingen');
    await client.createAccount('Vrije tijd');
    return res.send({ success: true, data: { users } });
};

const requestSandboxMoney = async (req: CustomRequest, res: Response): Promise<Response> => {
    try {
        await doRequestSandboxMoney(req.uid);
    } catch (err) {
        return res.status(400).send({ success: false, message: err });
    }
    return res.send({ success: true });
};

const getMonetaryAccounts = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const forceUpdate = req.query.forceupdate !== undefined ? true : false;
    console.log('forceUpdate', forceUpdate);
    const data = await bunqClient.getAccounts(true);
    return res.send({ data: data, success: true });
};

const getMonetaryAccountByName = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const accounts = await bunqClient.getAccounts();
    const result = accounts.find(account => account.description === req.params.name);
    if (result === null) return res.status(404).send({});
    res.send(result);
};

const getEvents = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const forceUpdate = req.query.forceupdate !== undefined ? true : false;
    const events = await bunqClient.getEvents(forceUpdate);
    return res.send(events);
};

const postPaymentInternal = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const payment = await bunqClient.makePaymentInternal(
        req.body.from,
        req.body.to,
        req.body.description,
        req.body.amount,
    );
    res.send(payment);
};

const postDraftPayment = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const payment = await bunqClient.makeDraftPayment(
        req.body.from,
        req.body.to,
        req.body.description,
        req.body.amount,
    );
    res.send(payment);
};

const getCards = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    return res.send(await bunqClient.getBunqJSClient().api.card.list(bunqClient.getUser().id));
};

const test = async (req: CustomRequest, res: Response): Promise<Response> => {
    const bunqClient = bunq.getClient(req.uid);
    const accounts = await bunqClient.getAccounts();
    const request = await bunqClient
        .createBunqMeTab({ type: 'id', value: accounts[0].id }, 'Gimme money', { value: '500', currency: 'EUR' })
        .catch(err => {
            console.log(err);
        });
    return res.send(request);
};

router.post('/oauth/exchange', basicAuthentication, asyncHandler(exchangeOAuthTokens));
router.get('/accounts', basicAuthentication, asyncHandler(getMonetaryAccounts));
router.get('/accounts/:name', basicAuthentication, asyncHandler(getMonetaryAccountByName));
router.get('/accounts', basicAuthentication, asyncHandler(getMonetaryAccounts));
router.post('/payment', basicAuthentication, asyncHandler(postPaymentInternal));
router.get('/events', basicAuthentication, asyncHandler(getEvents));
router.post('/draftpayment', basicAuthentication, asyncHandler(postDraftPayment));
router.get('/cards', basicAuthentication, asyncHandler(getCards));
router.get('/sandbox', basicAuthentication, asyncHandler(createSandboxAPIKey));
router.get('/sandbox/request', basicAuthentication, asyncHandler(requestSandboxMoney));
router.get('/test', basicAuthentication, asyncHandler(test));

export default router;
