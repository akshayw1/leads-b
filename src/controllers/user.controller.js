import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { generateToken } from '../utils/token.util';
import { verifyEmailTemplate } from '../utils/mailTemplate';
import { logout } from '../services/logout.service';
import sendEmail from '../services/sendEmail.service'; //this line  use sendGrid for sending email

//uncomment this line to use nodemailer for sending email
// import {sendEmail} from '../utils/sendEmail.util';
// import { emailConfig } from '../utils/mail.util';

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: 'email is already registered' });

    user = new User({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const userData = { id: user._id, name, email };
    const token = generateToken(userData);

    const verificationEmail = verifyEmailTemplate(token);
    await user.save();

    // use sendGrid for sending email
    sendEmail(email, 'Leads email verification', verificationEmail);

    // use nodemailer for sending email
    // sendEmail(
    //   emailConfig({
    //     email: email,
    //     subject: 'leads email verification',
    //     content: verificationEmail,
    //   })
    // );

    return res
      .status(201)
      .json({ message: 'Check your email to verify your account' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while register user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'user is not existed.' });

    const passwordMatches = bcrypt.compare(password, user.password);
    if (!passwordMatches)
      return res.status(401).json({ message: 'wrong credintial.' });

    const tokenInfo = {
      email,
      name: user.name,
      id: user._id,
    };
    const token = generateToken(tokenInfo);
    return res.status(200).json({ message: 'login successfully', token });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while register user' });
  }
};

const updateVerfiedUser = async (req, res) => {
  try {
    const { id } = req.user;
    let user = await User.findOne({ _id: id });
    if (!user)
      return res
        .status(404)
        .json({ message: 'Something went wrong while verifying user' });

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({
      message: 'Your account has verified successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      message: 'Failed to confirm user verification',
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await logout(req.headers.authorization);
    return res.status(200).json({
      message: 'Successfully logged out.',
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { registerUser, loginUser, updateVerfiedUser, logoutUser };
