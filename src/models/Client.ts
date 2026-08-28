import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  phone: string;
  dealAmount: number;
  paid: number;
  due: number;
  startDate: Date;
  endDate?: Date;
  projectEmail?: string;
  projectPassword?: string;
  projectLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    dealAmount: { type: Number, required: true, default: 0 },
    paid: { type: Number, required: true, default: 0 },
    due: { type: Number, required: true, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    projectEmail: { type: String },
    projectPassword: { type: String },
    projectLinks: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate due amount
ClientSchema.pre("save", function () {
  this.due = this.dealAmount - this.paid;
});

// Delete the cached model if it exists to allow schema updates in development (HMR)
if (mongoose.models.Client) {
  delete mongoose.models.Client;
}

export default mongoose.model<IClient>("Client", ClientSchema);
