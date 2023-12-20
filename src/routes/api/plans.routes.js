import { Router } from 'express';
import { createPlan, getPlans } from '../../controllers/plans.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const route = Router();

route.post('/', protectRoute, createPlan);
route.get('/', getPlans);

export default route;
