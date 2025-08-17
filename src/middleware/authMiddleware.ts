import { RequestHandler, Response, NextFunction } from "express";
import logger from "../utils/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const protect: RequestHandler = async (
  req,
  res: Response,
  next: NextFunction
) => {
  let token;
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret)
    throw new Error("JWT_SECRET not found in environment variables");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        logger.error("User not found", {
          id: decoded.id,
          route: req.originalUrl,
        });
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      logger.info("User authenticated", {
        id: decoded.id,
        route: req.originalUrl,
      });
      next();
    } catch (error) {
      logger.error("Token validation failed", {
        token,
        error,
        route: req.originalUrl,
      });
      if (!decoded || typeof decoded !== "object" || !decoded.id) {
        logger.warn("Invalid token payload", { token });
        return res.status(401).json({ message: "Token is not valid" });
      }
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    logger.warn("No token provided", { route: req.originalUrl });
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};
