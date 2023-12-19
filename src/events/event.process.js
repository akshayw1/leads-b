import { Plan } from '../models/plan';
import { User } from '../models/user';
import { knownEvents, subscribe } from './event.types';

const updateUserAfterSubscription = subscribe(
  knownEvents.SubscriptionCreated,
  async (data) => {
    try {
      const { userId, planId } = data;

      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      const plan = await Plan.findById(planId);
      if (!plan) throw new Error('Plan not found');

      user.searchQueriesPerDay = plan.searchQueriesPerDay;
      user.leadsPerDay = plan.leadsPerDay;

      await user.save();

      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user after subscription:', error);
    }
  }
);

export { updateUserAfterSubscription };
