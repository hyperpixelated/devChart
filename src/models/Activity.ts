import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  text: string;
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);