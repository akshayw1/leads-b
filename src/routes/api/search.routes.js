import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import {
  getUserStatistics,
  userSearch,
} from '../../controllers/search.controller';

const route = Router();

route.post('/', protectRoute, userSearch);
route.get('/statistics', protectRoute, getUserStatistics);

export default route;
