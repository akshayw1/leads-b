import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  searchQueriesPerDay: {
    type: Number,
    default: 0,
  },
  leadsPerDay: {
    type: Number,
    default: 0,
  },
  subscribedPlan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
  },
  subscriptionEnd: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

const User = model('User', userSchema);

export { User };
