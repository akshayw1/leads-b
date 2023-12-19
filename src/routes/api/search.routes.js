import { Router } from 'express';
import { protectRoute } from '../../middlewares/auth.middleware';
import { userSearch } from '../../controllers/search.controller';

const route = Router();

route.post('/', protectRoute, userSearch);

export default route;
