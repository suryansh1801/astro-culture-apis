import express from 'express';
import connectDB from './db';
import offerRoutes from './routes/offer-routes';
import logger from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();
logger.info('Attempting to connect to MongoDB...');

// Middlewares
app.use(express.json()); // To parse JSON request bodies

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// API Routes
app.use('/api/v1', offerRoutes);

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
