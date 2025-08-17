import { Schema, model, Document } from "mongoose";

export interface IHoroscopeHistory extends Document {
  userId: Schema.Types.ObjectId;
  zodiacSign: string;
  date: Date;
  horoscopeText: string;
}

const HoroscopeHistorySchema = new Schema<IHoroscopeHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    zodiacSign: { type: String, required: true },
    date: { type: Date, required: true },
    horoscopeText: { type: String, required: true },
  },
  { timestamps: true }
);

HoroscopeHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

export default model<IHoroscopeHistory>(
  "HoroscopeHistory",
  HoroscopeHistorySchema
);
