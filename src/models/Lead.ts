import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  types: string[];
  budget: string;
  timeline: string;
  details: string;
  status: "New" | "Contacted" | "In Progress" | "Completed" | "Lost";
  dealAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    types: { type: [String], default: [] },
    budget: { type: String, default: "" },
    timeline: { type: String, default: "" },
    details: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "In Progress", "Completed", "Lost"],
      default: "New",
    },
    dealAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent mongoose from recreating the model if it already exists
export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
