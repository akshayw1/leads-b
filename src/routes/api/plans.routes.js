import { Router } from 'express';
import { createPlan, deletePlan, getPlans, updatePlan } from '../../controllers/plans.controller';
import { protectRoute } from '../../middlewares/auth.middleware';

const route = Router();

route.post('/', protectRoute, createPlan);
route.get('/', getPlans);
route.delete('/delete/:id', deletePlan);
route.put('/update/:id', updatePlan);

export default route;
