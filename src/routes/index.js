import { Router } from 'express';
import userRoutes from './api/user.routes';
import planRoutes from './api/plans.routes';
import subscribeRoutes from './api/subscribe.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/plans', planRoutes);
routes.use('/subscription', subscribeRoutes);

export default routes;
