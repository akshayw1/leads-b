import { Router } from 'express';
import { createPlan } from '../../controllers/plans.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const route = Router();

route.post('/', protectRoute, createPlan);

export default route;
