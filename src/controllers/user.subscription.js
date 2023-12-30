import { Plan } from '../models/plan';
import { Payment } from '../models/payments';
import { User } from '../models/user';
import { stripe } from '../utils/stripe';
import { eventEmit, knownEvents } from '../events/event.types';
import { createStripeSession } from '../utils/payment.util';

const stripeCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const { user } = req;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: 'plan is not existed' });

    const existUser = await User.findById(user._id);
    if (!existUser) {
      return res.status(404).json({ message: 'user is not existed' });
    }

    const payment = new Payment({
      status: 'pending',
      plan: plan._id,
      user: user._id,
    });

    const customer = await stripe.customers.create({
      name: user.name,
      metadata: {
        plan: JSON.stringify(plan),
        paymentId: payment._id.toString(),
        name: user.name,
      },
    });

    const lineItems = [
      {
        price_data: {
          currency: 'inr',
          unit_amount: plan.price * 100,
          product_data: {
            name: plan.name,
          },
        },
        quantity: 1,
      },
    ];

    const session = await createStripeSession(lineItems, customer);

    await payment.save();

    return res.status(200).json({
      message: 'Creating checkout session successful',
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'Could not create checkout session',
    });
  }
};

const stripeSuccess = async (req, res) => {
  try {
    const { paymentId } = req.query;
    let data = await stripe.checkout.sessions.retrieve(paymentId);
    if (!data)
      return res.status(404).json({ message: ' stripe payment not found' });
    if (process.env.NODE_ENV === 'test') data.payment_status = 'paid';

    if (data.payment_status === 'paid') {
      const customer = await stripe.customers.retrieve(data.customer);
      const { paymentId } = customer.metadata;

      const payment = await Payment.findById(paymentId);
      if (!payment)
        return res.status(404).json({ message: 'payment not found' });

      const user = await User.findById(payment.user);
      if (!user) return res.status(404).json({ message: 'user not found' });

      user.subscribedPlan = payment.plan;
      user.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await user.save();

      payment.status = 'paid';
      payment.stripeId = paymentId;
      await payment.save();

      eventEmit(knownEvents.SubscriptionCreated, {
        userId: user._id,
        planId: payment.plan,
      });

      res.status(201).json({
        message: 'You subscription has been created successfully',
        payment: payment._id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'plan not payed',
    });
  }
};
  
const stripeCancel = (req, res) => {
  return res.status(200).json({ message: 'Payment canceled' });
};

const getYourPayment = async (req, res) => {
  try {
    const payment = await Payment.find({});
    if (!payment) return res.status(404).json({ message: 'payment not found' });

    return res.status(200).json({
      message: 'Your payment',
      payment: payment,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: 'Failed to get your payment',
    });
  }
};

export { stripeCheckoutSession, stripeSuccess, stripeCancel, getYourPayment };
