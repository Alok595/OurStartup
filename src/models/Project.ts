import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  liveUrl?: string;
  badge?: string;
  
  // Extended details
  year?: string;
  client?: string;
  budget?: string;
  duration?: string;
  services?: string[];
  
  heroImage?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string[];
  
  pagesBuilt?: Array<{ name: string; desc: string; icon: string }>;
  techStack?: Array<{ name: string; icon: string }>;
  gallery?: string[];
  
  featured?: boolean;
  
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, default: "#D9600A" },
  liveUrl: { type: String },
  badge: { type: String },
  
  year: { type: String },
  client: { type: String },
  budget: { type: String },
  duration: { type: String },
  services: [{ type: String }],
  
  heroImage: { type: String },
  overview: { type: String },
  challenge: { type: String },
  solution: { type: String },
  impact: [{ type: String }],
  
  pagesBuilt: [
    {
      name: { type: String },
      desc: { type: String },
      icon: { type: String }
    }
  ],
  techStack: [
    {
      name: { type: String },
      icon: { type: String }
    }
  ],
  gallery: [{ type: String }],
  
  featured: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
