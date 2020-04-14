/* eslint-disable @typescript-eslint/camelcase */
import express, { Request, Response } from 'express';
const router = express.Router();
import Cache from 'simple-cache-js';
import jwt from 'jsonwebtoken';
import Encryption from 'simple-encrypt-js';
import { logging } from '../../server';

const encryption = new Encryption();
const key = encryption.generateRandomKey(32);

import { getAppData } from '../../app';
import { basicAuthentication } from '../middleware/authentication';
import { cacheMiddleware, asyncHandler } from '../modules/express-collection';

const oauthCache = new Cache();

/**
 * Format the OAuth Url
 * @param req Request object from Express
 * @param res Response object from Express
 */
const formatUrl = (req: Request, res: Response): Response => {
    const oauthobject = getAppData('oauth.' + req.params.application);
    // Authorization oauth2 URI
    const token = jwt.sign(
        {
            //exp: Math.floor(Date.now() / 1000) + 60,
            timestamp: new Date(),
            origin: req.headers.referer,
        },
        key,
    );
    const authorizationUri = oauthobject.formatUrl(token);
    return res.send(authorizationUri);
};

/**
 * Exchange Oauth tokens
 * @param req Request object from Express
 * @param res Response object from Express
 */
const exchange = async (req: Request, res: Response): Promise<Response> => {
    const oauthobject = getAppData('oauth.' + req.params.application);

    let decoded;
    if (req.body.state) {
        logging.info('State paramter is' + req.body.state);
        try {
            decoded = jwt.verify(req.body.state, key);
        } catch (err) {
            logging.error('Unable to verify JWT');
            return res.status(400).send({ success: false, message: err });
        }
    }

    // Save the access token
    try {
        const accessToken = await oauthobject.getToken(req.body.code);
        const accessTokenObject = {
            access_token: accessToken.token.access_token,
            expires_at: accessToken.token.expires_at,
            expires_in: accessToken.token.expires_in,
            refresh_token: accessToken.token.refresh_token,
            scope: accessToken.token.scope,
            token_type: accessToken.token.token_type,
        };
        return res.send({ success: true, data: { token: accessTokenObject, state: decoded } });
    } catch (error) {
        console.log(error.message, error.output);
        return res.status(400).send({ success: false, message: error.message, output: error.output });
    }
};

/**
 * Refresh oauth token
 * @param req Request object from Express
 * @param res Response object from Express
 */
const refresh = async (req: Request, res: Response): Promise<Response> => {
    try {
        const oauthobject = getAppData('oauth.' + req.params.application);
        const accessToken = await oauthobject.refresh(req.body);
        const accessTokenObject = {
            access_token: accessToken.token.access_token,
            expires_at: accessToken.token.expires_at,
            expires_in: accessToken.token.expires_in,
            refresh_token: accessToken.token.refresh_token,
            scope: accessToken.token.scope,
            token_type: accessToken.token.token_type,
        };
        return res.send({ success: true, data: { token: accessTokenObject } });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: error.message, output: error.output });
    }
};

router.use(basicAuthentication);
router.get('/formatUrl/:application', cacheMiddleware(oauthCache), asyncHandler(formatUrl));
router.post('/exchange/:application', asyncHandler(exchange));
router.post('/refresh/:application', asyncHandler(refresh));

export default router;
