import express from 'express';
const router = express.Router();

import Cache from 'simple-cache-js';

import SequelizeRoutes from '../modules/express-sequelize-routes';
import { basicAuthentication } from '../middleware/authentication';
import { cacheMiddleware, asyncHandler } from '../modules/express-collection';
import { Meterstanden } from '../models';

const longCache = new Cache();
const shortCache = new Cache(300);
const routes = new SequelizeRoutes({ idColumnName: 'id', userColumnName: 'userId', reqUserProperty: 'uid' });

router.get('/:id', basicAuthentication, cacheMiddleware(longCache), asyncHandler(routes.get(Meterstanden)));
router.get('/', basicAuthentication, cacheMiddleware(shortCache), asyncHandler(routes.list(Meterstanden)));
router.post('/', basicAuthentication, asyncHandler(routes.create(Meterstanden)));
router.put('/:id', basicAuthentication, asyncHandler(routes.update(Meterstanden)));
router.delete('/:id', basicAuthentication, asyncHandler(routes.destroy(Meterstanden)));
router.get('/:column/:value', basicAuthentication, cacheMiddleware(longCache), asyncHandler(routes.find(Meterstanden)));

export default router;
