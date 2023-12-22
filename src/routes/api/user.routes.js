import { Router } from 'express';
import {
  registerUser,
  loginUser,
  updateVerfiedUser,
} from '../../controllers/user.controller';
import registerValidation from '../../validations/user.validation';
import {
  checkIfUserIsVerified,
  verifyAndRevokeToken,
} from '../../middlewares/auth.middleware';

const route = Router();

route.post('/signup', registerValidation, registerUser);
route.post('/login', checkIfUserIsVerified, loginUser);
route.get('/verify-email/:token', verifyAndRevokeToken, updateVerfiedUser);

export default route;
