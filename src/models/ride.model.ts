import mongoose, { Schema, Document, Types } from "mongoose"

export interface IRide extends Document {
  _id: Types.ObjectId;
  customerId: number;
  origin: string;
  destination: string;
  duration: string,
  distance: string;
  durationValue: number;
  distanceValue: number;
  value: string;
  driver: {
    id: number;
    name: string;
  },
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const RideSchema: Schema = new Schema({
  customerId: { type: Number, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  distance: { type: String, required: true },
  durationValue: { type: Number, required: true },
  distanceValue: { type: Number, required: true },
  value: { type: String, required: true },
  driver: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed'],
    default: 'pending'
  },

}, { timestamps: true }
  
)

export default mongoose.model<IRide>('Ride', RideSchema)

