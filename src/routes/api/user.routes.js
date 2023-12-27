import { Router } from 'express';
import {
  registerUser,
  loginUser,
  updateVerfiedUser,
  logoutUser,
  updatePassword,
} from '../../controllers/user.controller';
import registerValidation from '../../validations/user.validation';
import {
  checkIfUserIsVerified,
  protectRoute,
  verifyAndRevokeToken,
} from '../../middlewares/auth.middleware';

const route = Router();

route.post('/signup', registerValidation, registerUser);
route.post('/login', checkIfUserIsVerified, loginUser);
route.post('/logout', protectRoute, logoutUser);
route.post('/change-password', protectRoute, updatePassword);
route.get('/verify-email/:token', verifyAndRevokeToken, updateVerfiedUser);

export default route;
