import express from 'express';
import morgan from 'morgan';

import allRoutes from './routes/index';
import {
  updateUserAfterSubscription,
  updateUserAfterSearch,
  updateUserEveryNight,
} from './events/event.process';
import { resetAccess } from './cron-job/reset.access';

const app = express();

app.use(morgan('combined'));
app.use(express.json());
resetAccess.start();

app.use('/api/v1', allRoutes);
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Leads API' });
});

export default app;
