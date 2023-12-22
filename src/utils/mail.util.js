import dotenv from 'dotenv';

dotenv.config();

export function emailConfig({ email, subject, content } = {}) {
  return {
    from: {
      name: 'Leads App',
      address: process.env.EMAIL_USERNAME,
    },
    to: `${email}`,
    subject: `${subject}`,
    html: `${content}`,
  };
}
