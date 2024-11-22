import mongoose, { Schema, Document } from "mongoose"
import { Db } from "mongodb";

export interface IIdCounter extends Document {
  name: string;
  seq: number;
}

const IdCounterSchema: Schema = new Schema({
  name: { type: String, required: true },
  seq: { type: Number, required: true, default: 0 },
})

const IdCounter = mongoose.model<IIdCounter>('id_counters', IdCounterSchema)

export default IdCounter


