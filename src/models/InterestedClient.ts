import mongoose, { Schema, Document } from "mongoose";

export interface IInterestedClient extends Document {
  name: string;
  phone: string;
  status: "Interested" | "Rejected" | "Pending";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterestedClientSchema = new Schema<IInterestedClient>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Interested", "Rejected", "Pending"],
      default: "Interested",
    },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Delete the cached model if it exists to allow schema updates in development (HMR)
if (mongoose.models.InterestedClient) {
  delete mongoose.models.InterestedClient;
}

export default mongoose.model<IInterestedClient>("InterestedClient", InterestedClientSchema);

