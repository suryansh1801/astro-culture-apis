import { Schema, model, Document, HookNextFunction } from "mongoose";
import bcrypt from "bcryptjs";

// Interface to represent a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because we remove it on selection
  birthdate: Date;
  zodiacSign: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // Hide by default
    birthdate: { type: Date, required: true },
    zodiacSign: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next: HookNextFunction) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model<IUser>("User", UserSchema);
