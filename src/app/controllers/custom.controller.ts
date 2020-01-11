import express, { Request, Response } from 'express';
const router = express.Router();
import { asyncHandler } from 'express-collection';
import axios from 'axios';
import { basicAuthentication } from '../middleware/authentication';

export const redirectCall = async (req: Request, res: Response): Promise<Response> => {
    const { body, headers, url, method } = req.body;

    console.log('Making call to ' + url + ' with method ' + method);
    const data = await axios({
        url,
        method,
        headers,
        data: body,
    });
    return res.send(data);
};

router.post('/proxyrequest', basicAuthentication, asyncHandler(redirectCall));
export default router;
