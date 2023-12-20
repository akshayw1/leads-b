import { Plan } from '../models/plan';
import { Payment } from '../models/payments';
import { User } from '../models/user';
import { stripe } from '../utils/stripe';
import { eventEmit, knownEvents } from '../events/event.types';

const subscribeToPlan = async (req, res) => {
  const { token } = req.body;
  const { planId } = req.params;
  const { user } = req;

  const plan = await Plan.findById(planId);
  if (!plan) return res.status(404).json({ message: 'plan is not existed' });

  const existUser = await User.findById(user._id);
  if (!existUser) {
    return res.status(404).json({ message: 'user is not existed' });
  }

  if (plan.price === 0) {
    user.subscribedPlan = plan._id;
    user.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    eventEmit(knownEvents.SubscriptionCreated, { userId: user._id, planId });

    return res
      .status(201)
      .json({ message: `You have subscribed Our Plan: ${plan.name}` });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: plan.price * 100, // in cents
    currency: 'inr',
    payment_method_types: ['card'],
    payment_method: 'pm_card_visa',
    confirm: true,
    metadata: { planName: plan.name, userId: existUser._id },
  });

  user.subscribedPlan = plan._id;
  user.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const payment = new Payment({
    user: user._id,
    plan: plan._id,
    amount: plan.price,
    stripeId: paymentIntent.id,
  });

  await user.save();
  await payment.save();

  eventEmit(knownEvents.SubscriptionCreated, { userId: user._id, planId });

  return res.status(201).json({
    message: `You have subscribed To Plan: ${plan.name}`,
    id: paymentIntent.id,
  });
};

export { subscribeToPlan };
