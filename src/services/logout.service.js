import Blacklist from '../models/blacklList';

export const logout = async (userData) => {
  const token = userData.split(' ')[1];
  await new Blacklist({ token }).save();
};
