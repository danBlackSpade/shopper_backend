

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: number;
  role: string;
  name: string;
  description: string | null;
  car: string | null;
  rating: {
    value: number;
    description: string;
  } | null;
  fee: number | null;
  minMeters: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const UserSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  description: {
    type: String,
    required: function (this: IUser) {
      return this.role === 'driver'}
  },
  car: {
    type: String,
    required: function (this: IUser) {
      return this.role === 'driver'
    }
  },
  rating: {
    value: {
      type: Number,
      required: function (this: IUser) {
        return this.role === 'driver'
    }},
    description: {
      type: String,
      required: function (this: IUser) {
        return this.role === 'driver'
    }},
  },
  fee: {
    type: Number,
    required: function (this: IUser) {
      return this.role === 'driver'
    }
  },
  minMeters: {
    type: Number,
    required: function (this: IUser) {
      return this.role === 'driver'
    }
  }
}, { timestamps: true })

export default mongoose.model<IUser>('User', UserSchema)