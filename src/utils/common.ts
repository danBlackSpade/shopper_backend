import { Db } from "mongodb";
import mongoose from "mongoose";
import IdCounter from "../models/idCounter.model";


/**
 * Fetches the next sequence for a given counter.
 * @param db - MongoDB database instance.
 * @param counterName - Name of the counter (e.g., "user", "order").
 * @returns The next sequence number.
 */
export async function getNextSequence(counterName: string): Promise<number> {
  // const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopper-rides'

  // await mongoose.connect(mongoUri)
  //       console.log('MongoDB connected')
  const db = await mongoose.connection.db as Db;

  // const result = await db.collection("id_counters").findOneAndUpdate(
  const result = await IdCounter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } }, // Increment the `seq` field by 1
    { returnDocument: "after", upsert: true } // Create a new document if it doesn't exist
  );

  console.log("findOneAndUpdate result:", result);

  if (result && typeof result.seq === "number") {
    console.log(`Next sequence for ${counterName}: ${result.seq}`);
    return result.seq;
  } else {
    throw new Error(`Failed to fetch the next sequence for counter "${counterName}"`);
  }

  // return result..seq;
}
