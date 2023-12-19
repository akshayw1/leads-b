import cron from 'node-cron';
import dotenv from 'dotenv';
import { eventEmit, knownEvents } from '../events/event.types';

dotenv.config();

const resetAccess = cron.schedule(process.env.CRON_TIME, () => {
  eventEmit(knownEvents.UpdateUserAcess, { data: 'update data' });
});

export { resetAccess };
