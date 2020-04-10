import express from 'express';
const router = express.Router();

import { get, find, list, create, update, destroy } from 'express-sequelize-routes';
import { basicAuthentication } from '../middleware/authentication';
import { cacheMiddleware, asyncHandler } from 'express-collection';
import Cache from 'simple-cache-js';

import { Meterstanden } from '../models';

const longCache = new Cache();
const shortCache = new Cache(300);

router.get('/:id', basicAuthentication, cacheMiddleware(longCache), asyncHandler(get(Meterstanden)));
router.get('/', basicAuthentication, cacheMiddleware(shortCache), asyncHandler(list(Meterstanden)));
router.post('/', basicAuthentication, asyncHandler(create(Meterstanden)));
router.put('/:id', basicAuthentication, asyncHandler(update(Meterstanden)));
router.delete('/:id', basicAuthentication, asyncHandler(destroy(Meterstanden)));
router.get('/:column/:value', basicAuthentication, cacheMiddleware(longCache), asyncHandler(find(Meterstanden)));

export default router;
