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

export const checkIfUserIsVerified = async (req, res, next) => {
  const { email } = req.body;

  const isVerified = await User.findOne({ email });
  if (!isVerified.isEmailVerified) {
    return res.status(403).json({ message: 'User email is not verified.' });
  }
  next();
};

export const verifyAndRevokeToken = async (req, res, next) => {
  const { token } = req.params;
  const decoded = verifyToken(token);
  console.log(decoded);
  if (decoded) {
    req.user = decoded.data;

    next();
  } else {
    return res.status(403).json({ message: 'Failed to verify email' });
  }
};
