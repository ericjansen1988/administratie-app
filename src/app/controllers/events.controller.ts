import express from 'express';
const router = express.Router();

import SequelizeRoutes from '../modules/express-sequelize-routes';
import { basicAuthentication } from '../middleware/authentication';
import { cacheMiddleware, asyncHandler } from '../modules/express-collection';
import Cache from 'simple-cache-js';

import { Events } from '../models';

const eventsCache = new Cache();
const shortCache = new Cache(60);
const routes = new SequelizeRoutes({ idColumnName: 'id', userColumnName: 'userId', reqUserProperty: 'uid' });

router.get('/:id', basicAuthentication, cacheMiddleware(eventsCache), asyncHandler(routes.get(Events)));
router.get('/', basicAuthentication, cacheMiddleware(shortCache), asyncHandler(routes.list(Events)));
router.post('/', basicAuthentication, asyncHandler(routes.create(Events)));
router.put('/:id', basicAuthentication, asyncHandler(routes.update(Events)));
router.delete('/:id', basicAuthentication, asyncHandler(routes.destroy(Events)));
router.get('/:column/:value', basicAuthentication, cacheMiddleware(eventsCache), asyncHandler(routes.find(Events)));

export default router;
