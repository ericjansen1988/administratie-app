import admin, { firestore } from '../modules/Firebase';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
    headers: any;
    uid?: string;
    jwt?: any;
}

const checkAuthenticated = async (req: CustomRequest, res: Response, options: any = {}): Promise<void | any> => {
    //Checken of er een custom token is
    //const token = "homebridge-authenticated"
    const authHeader = req.headers.authorization || '';
    //console.log(req.headers);
    const apimatch = authHeader.match(/Apitoken (.+)/);
    const remoteIP = req.socket.remoteAddress;
    if (!apimatch && options.token !== undefined) return { result: false, reason: 'No API token given' };
    if (apimatch && options.token) {
        const accessToken = apimatch[1];
        console.log(accessToken, remoteIP, remoteIP.endsWith('192.168.178.1'));
        const localaddress = remoteIP.endsWith('192.168.178.1') ? true : false;
        if (localaddress === false) return { result: false, reason: 'No local address' };
        if (accessToken !== options.token) return { result: false, reason: 'Token doesnt match' };
        return { result: true, jwt: false };
        //return res.status(401).end();
    }

    //Checken of er Firebase authenticatie is
    const firebasematch = authHeader.match(/Firebase (.+)/);
    if (firebasematch) {
        const firebaseToken = firebasematch[1];
        try {
            const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
            console.log(decodedToken);
            return { result: true, jwt: decodedToken };
        } catch (err) {
            return { result: false, reason: err };
        }
    }

    if (!firebasematch && req.query.api_key !== undefined) {
        console.log('Authenticatie op basis van apikey');
        const userdoc = await firestore
            .collection('env')
            .doc(process.env.REACT_APP_FIRESTORE_ENVIRONMENT)
            .collection('users')
            .where('api.key', '==', req.query.api_key)
            .limit(1)
            .get();
        if (userdoc.empty)
            return { result: false, reason: 'API key was given with query param but not found in database' };
        const doc = userdoc.docs[0];
        return { result: true, jwt: { claims: { uid: doc.id } } };
    } else if (!firebasematch && process.env.NODE_ENV === 'development') {
        let user = 'p1ezZHQBsyWQDYm9BrCm2wlpP1o1';
        if (req.query.user !== undefined) user = req.query.user;
        console.log('Authentication passed, env=DEV, user=' + user);
        return { result: true, jwt: { claims: { uid: user } } };
    } else {
        return { result: false, message: 'No authentication' };
    }
};

const authenticationRequired = (options?: any) => (req: CustomRequest, res: Response, next: NextFunction): void => {
    checkAuthenticated(req, res, options).then((authenticated: any) => {
        console.log('Authentication result ', authenticated);
        if (authenticated.result === true) {
            req.jwt = authenticated.jwt;
            if (authenticated.jwt !== false) {
                const uid = req.jwt.claims === undefined ? req.jwt.uid : req.jwt.claims.uid;
                console.log('User ' + uid + ' successfully authenticated');
                req.uid = uid;
            }
            next();
        } else {
            return res.status(401).send(authenticated.reason);
        }
    });
};

export default authenticationRequired;
export const basicAuthentication = authenticationRequired();
export const adminAuthentication = authenticationRequired({ group: 'Admins' });
