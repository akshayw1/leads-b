import bcrpt from 'bcrypt';

export const hashPassword = async (password) => {
  const pasSalt = await bcrpt.genSalt(10);
  return bcrpt.hash(password, pasSalt);
};

export const comparePassword = async (userPass, hashpass) =>
  bcrpt.compare(userPass, hashpass);
