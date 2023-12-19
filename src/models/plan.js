import { number, required } from 'joi';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const planSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  searchQueriesPerDay: {
    type: Number,
    required: true,
  },
  leadsPerDay: {
    type: Number,
    required: true,
  },
  daysDuration: {
    type: Number,
    required: true,
    default: 30,
  },
  createdAt: { type: Date, default: Date.now },
});

const Plan = model('Plan', planSchema);

export { Plan };
