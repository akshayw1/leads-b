import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.SEND_GRID_API_KEY;

sgMail.setApiKey(apiKey);

const sendEmail = (sendToEmail, subject, HTMLText) => {
  const message = {
    to: sendToEmail,
    from: {
      name: 'LEADS APP',
      email: process.env.SEND_GRID_EMAIL,
    },
    subject,

    html: HTMLText,
  };
  sgMail
    .send(message)
    .then((res) => console.log('email sent...'))
    .catch((error) => {
      console.log(error.message);
    });
};

export default sendEmail;
