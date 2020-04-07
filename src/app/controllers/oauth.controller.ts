/* eslint-disable @typescript-eslint/camelcase */
import express, { Request, Response } from 'express';
const router = express.Router();
import { cacheMiddleware, asyncHandler } from 'express-collection';

import { getAppData } from '../../app';
import { basicAuthentication } from '../middleware/authentication';
import Cache from 'simple-cache-js';
const oauthCache = new Cache();

/**
 * Format the OAuth Url
 * @param req Request object from Express
 * @param res Response object from Express
 */
const formatUrl = (req: Request, res: Response): Response => {
    const oauthobject = getAppData('oauth.' + req.params.application);
    // Authorization oauth2 URI
    const authorizationUri = oauthobject.formatUrl();
    return res.send(authorizationUri);
};

/**
 * Exchange Oauth tokens
 * @param req Request object from Express
 * @param res Response object from Express
 */
const exchange = async (req: Request, res: Response): Promise<Response> => {
    const oauthobject = getAppData('oauth.' + req.params.application);

    // Save the access token
    try {
        const accessToken = await oauthobject.getToken(req.body.code);
        console.log(accessToken);
        const accessTokenObject = {
            access_token: accessToken.token.access_token,
            expires_at: accessToken.token.expires_at,
            expires_in: accessToken.token.expires_in,
            refresh_token: accessToken.token.refresh_token,
            scope: accessToken.token.scope,
            token_type: accessToken.token.token_type,
        };
        return res.send({ success: true, data: accessTokenObject });
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
        return res.send({ success: true, data: accessTokenObject });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ success: false, message: error.message, output: error.output });
    }
};

router.get('/formatUrl/:application', basicAuthentication, cacheMiddleware(oauthCache), asyncHandler(formatUrl));
router.post('/exchange/:application', basicAuthentication, asyncHandler(exchange));
router.post('/refresh/:application', basicAuthentication, asyncHandler(refresh));

export default router;
