import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Payment = model('Payment', paymentSchema);

export { Payment };
