import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

const Blacklist = mongoose.model('Blacklist', tokenSchema);

export default Blacklist;
