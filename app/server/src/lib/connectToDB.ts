import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectToDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Connected to MongoDB\n\n");
  } catch (error) {
    throw new Error(
      `Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export default connectToDB;
