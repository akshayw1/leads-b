import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import allRoutes from './routes/index';
import {
  updateUserAfterSubscription,
  updateUserAfterSearch,
  updateUserEveryNight,
} from './events/event.process';
import { resetAccess } from './cron-job/reset.access';

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(morgan('combined'));
app.use(express.json());
resetAccess.start();

app.use('/api/v1', allRoutes);
app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Leads API' });
});

export default app;
