import { Router } from 'express';
import {
  stripeCheckoutSession,
  stripeSuccess,
  stripeCancel,
  getYourPayment,
  getAllPayments,
} from '../../controllers/user.subscription';
import { protectRoute } from '../../middlewares/auth.middleware';

const route = Router();

route.post('/create-checkout-session', protectRoute, stripeCheckoutSession);
route.get('/your-payment', protectRoute, getYourPayment);
route.get('/success', stripeSuccess);
route.get('/cancel', stripeCancel);
route.get('/',protectRoute,getAllPayments)

export default route;
