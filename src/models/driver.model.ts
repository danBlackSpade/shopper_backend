

import mongoose, { Schema, Document } from "mongoose";

export interface IDriver extends Document {
  name: string;
  description: string;
  car: {
    model: string;
    color: string;
    year: number;
  },
  rating: {
    value: number;
    description: string;
  },
  fee: number;
  minKm: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const DriverSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  car: { type: String, required: true },
  rating: {
    value: { type: Number, required: true },
    description: { type: String, required: true },
  },
  fee: { type: Number, required: true },
  minKm: { type: Number, required: true },
}, {
  timestamps: true
})

export default mongoose.model<IDriver>('Driver', DriverSchema)