import express, { Express, Request, Response } from "express";
import logger from "./utils/logger";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import setupSwagger from "./swagger";
import authRoutes from "./routes/auth";
import horoscopeRoutes from "./routes/horoscope";

dotenv.config();
connectDB();

const app: Express = express();

app.use(express.json());
app.use(cors());

// Log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`, { ip: req.ip });
  next();
});

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/horoscope", horoscopeRoutes);

app.get("/", (req: Request, res: Response) => {
  logger.info("Health check endpoint hit");
  res.send("Horoscope API (TypeScript) is running...");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error("Unhandled error", { error: err });
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
