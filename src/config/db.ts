import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      logger.error("MONGO_URI not found in .env file");
      process.exit(1);
    }
    await mongoose.connect(mongoURI);
    logger.info("MongoDB Connected...");
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error("An unknown error occurred during DB connection");
    }
    process.exit(1);
  }
};

export default connectDB;
