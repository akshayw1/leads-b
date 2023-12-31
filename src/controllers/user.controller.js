import { User } from '../models/user';
import { Plan } from '../models/plan';
import { knownEvents, eventEmit } from '../events/event.types';
import { generateToken } from '../utils/token.util';
import { comparePassword, hashPassword } from '../utils/bcrypt.util';
import { verifyEmailTemplate } from '../utils/mailTemplate';
import { logout } from '../services/logout.service';
// import sendEmail from '../services/sendEmail.service'; //this line  use sendGrid for sending email

//uncomment this line to use nodemailer for sending email
import {sendEmail} from '../utils/sendEmail.util';
import { emailConfig } from '../utils/mail.util';

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
    user.password = await hashPassword(user.password);

    const userData = { id: user._id, name, email };
    const token = generateToken(userData);

    const verificationEmail = verifyEmailTemplate(token);

    const freePlan = await Plan.findOne({ price: 0 });

    if (!freePlan) {
      return res.status(500).json({ message: 'Free plan not found' });
    }

    user.subscribedPlan = freePlan._id;
    user.subscriptionEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await user.save();

    eventEmit(knownEvents.SubscriptionCreated, {
      userId: user._id,
      planId: freePlan._id,
    });

    // use sendGrid for sending email
    // sendEmail(email, 'Leads email verification', verificationEmail);

    // use nodemailer for sending email
    sendEmail(
      emailConfig({
        email: email,
        subject: 'leads email verification',
        content: verificationEmail,
      })
    );

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

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches)
      return res.status(404).json({ message: 'wrong credential.' });

    const tokenInfo = {
      email,
      name: user.name,
      id: user._id,
    };
    const token = generateToken(tokenInfo);
    if (user.role && user.role.admin) {
      return res.status(200).json({
        message: 'Login successful for admin',
        token,
        isAdmin: true,
        redirect: 'http://localhost:5173/admin', 
      });
    }

    // For regular users, no isAdmin field is included, and you can handle their redirect on the client side.
    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'An error occurred while register user' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    // Check current password
    const compareUserPassword = await comparePassword(
      currentPassword,
      user.password
    );

    if (!compareUserPassword) {
      return res.status(404).json({ message: 'Current password is incorrect' });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: 'New password cannot be same as old password' });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: 'An error occurred while updating password' });
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


const getAllUser = async (req,res)=>{

  const alluser = await User.find({});
  console.log(alluser);

  try{
      res.status(200).json({
      data : alluser,
      countuser: alluser.length
    })

  }catch (error){
    res.status(500).json({message:error});
  }
}

export {
  registerUser,
  loginUser,
  updateVerfiedUser,
  logoutUser,
  updatePassword,
  getAllUser
};
