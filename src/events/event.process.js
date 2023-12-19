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

const updateUserAfterSearch = subscribe(
  knownEvents.UserMadeSearch,
  async (data) => {
    try {
      const { userId, leadsFound } = data;

      const user = await User.findById(userId);

      if (!user) throw new Error('User not found');

      user.searchQueriesPerDay -= 1;
      user.leadsPerDay -= leadsFound;

      await user.save();

      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user after searching:', error);
    }
  }
);

const updateUserEveryNight = subscribe(
  knownEvents.UpdateUserAcess,
  async (data) => {
    try {
      const users = await User.find({}).populate('subscribedPlan');

      // for (let user of users) {
      //   user.searchQueriesPerDay = user.subscribedPlan.searchQueriesPerDay;
      //   user.leadsPerDay = user.subscribedPlan.leadsPerDay;
      //   await user.save();
      // }
      // console.log('User access updated');
    } catch (error) {
      console.error('Error updating user access:', error);
    }
  }
);

export {
  updateUserAfterSubscription,
  updateUserAfterSearch,
  updateUserEveryNight,
};
