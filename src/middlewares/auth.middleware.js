import dotenv from 'dotenv';
import { User } from '../models/user';
import { verifyToken } from '../utils/token.util';

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ status: 401, message: 'Please sign in' });
    }
    const token = req.header('Authorization').split(' ')[1];

    const details = verifyToken(token);

    const userExists = await User.findOne({ email: details.data.email });

    if (!userExists) {
      return res.status(401).json({ status: 401, message: 'Please Login!' });
    }
    req.user = userExists;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: 401, message: 'No valid credentials' });
  }
};
