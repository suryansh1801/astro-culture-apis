import { Request, RequestHandler, Response } from "express";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { getZodiacSign } from "../utils/zodiacCalculator";

const generateToken = (id: string): string => {
  logger.debug(`Generating JWT for user: ${id}`);
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logger.error("JWT_SECRET not defined");
    throw new Error("JWT_SECRET not defined");
  }
  if (!jwtSecret) throw new Error("JWT_SECRET not defined");
  return jwt.sign({ id }, jwtSecret, { expiresIn: "1d" });
};

export const signup: RequestHandler = async (req, res) => {
  logger.info("Signup attempt", { email: req.body.email });
  const { name, email, password, birthdate } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn("Signup failed: User already exists", {
        email: req.body.email,
      });
      return res.status(400).json({ message: "User already exists" });
    }
    const zodiacSign = getZodiacSign(new Date(birthdate));
    const newUser = new User({
      name,
      email,
      password,
      birthdate,
      zodiacSign,
    });
    await newUser.save();
    logger.info("User registered successfully", { userId: newUser._id, email });
    const token = generateToken(newUser._id);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      zodiacSign: newUser.zodiacSign,
      token,
    });
  } catch (error) {
    logger.error("Signup failed", { email: req.body.email, error });
    res.status(500).json({ message: "Server Error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  logger.info("Login attempt", { email: req.body.email });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn("Login failed: User not found", { email: req.body.email });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isUserAuthenticated = await user.comparePassword(password);
    if (isUserAuthenticated) {
      logger.info("User logged in successfully", { userId: user._id, email });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
      });
    } else {
      logger.warn("Login failed: Invalid password", { email: req.body.email });
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    logger.error("Login failed", { email: req.body.email, error });
    res.status(500).json({ message: "Server Error" });
  }
};
