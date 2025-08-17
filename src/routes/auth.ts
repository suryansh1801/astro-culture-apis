import { Router } from "express";
import logger from "../utils/logger";
import { signup, login } from "../controllers/authController";
import { check, validationResult } from "express-validator";
import { RequestHandler } from "express";

const router = Router();

const validateRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * /api/auth/signup:
 *  post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - email
 *                          - password
 *                          - birthdate
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Jane Doe"
 *                          email:
 *                              type: string
 *                              format: email
 *                              example: "jane.doe@example.com"
 *                          password:
 *                              type: string
 *                              format: password
 *                              example: "password123"
 *                          birthdate:
 *                              type: string
 *                              format: date
 *                              example: "1990-05-15"
 *      responses:
 *          201:
 *              description: User registered successfully
 *          400:
 *              description: Bad request (e.g., user already exists, invalid data)
 */
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
    check("birthdate", "Birthdate is required and must be a valid date")
      .isISO8601()
      .toDate(),
    validateRequest,
  ],
  (req, res, next) => {
    logger.info("/signup route hit", { email: req.body.email });
    return signup(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid email or password
 */
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    validateRequest,
  ],
  (req, res, next) => {
    logger.info("/login route hit", { email: req.body.email });
    return login(req, res, next);
  }
);

export default router;
