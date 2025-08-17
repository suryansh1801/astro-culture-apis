import mongoose from 'mongoose';
import logger from './utils/logger';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI as string; // MongoDB connection string
        await mongoose.connect(mongoURI);
        logger.info('MongoDB Connected.');
    } catch (err) {
        logger.error(
            `Failed to connect to MongoDB: ${(err as Error).message}.`,
        );
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
