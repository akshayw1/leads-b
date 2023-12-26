import { Router } from 'express';
import userRoutes from './api/user.routes';
import planRoutes from './api/plans.routes';
import subscribeRoutes from './api/subscribe.routes';
import userSearchRoutes from './api/search.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/plans', planRoutes);
routes.use('/payments', subscribeRoutes);
routes.use('/search', userSearchRoutes);

export default routes;
