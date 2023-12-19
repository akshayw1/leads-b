import { Router } from 'express';
import { createPlan } from '../../controllers/plans.controller';
import { protectRoute } from '../../middlewares/auth.middleware';
import { subscribeToPlan } from '../../controllers/user.subscription';

const route = Router();

route.post('/subscribe-plan/:planId', protectRoute, subscribeToPlan);

export default route;
