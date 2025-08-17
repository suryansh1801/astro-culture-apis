import { IUser } from "../models/User";

// To extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // 'user' property is optional and of type IUser
    }
  }
}
