import mongoose, { Schema, Document } from "mongoose"

export interface IRide extends Document {
  userId: string;
  origin: string;
  destination: string;
  distance: number; // google uses meters
  price: number;
  driverId: string;
  driverName: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const RideSchema: Schema = new Schema({
  userId: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    driverId: { type: String, required: true },
    driverName: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending'
    },

}, { timestamps: true })

export default mongoose.model<IRide>('Ride', RideSchema)

