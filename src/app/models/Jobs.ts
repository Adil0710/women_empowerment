import mongoose, { Schema, Document } from "mongoose";

export interface IJobs extends Document {
  position: string;
  company: string;
  location: string;
  description: string;
  type: "Full Time" | "Part Time" | "Internship" | "Contractual";
  level: "Entry" | "Experienced";
  department: string;
}

const JobsSchema = new Schema<IJobs>(
  {
    position: { type: String, required: [true, "position is required"] },
    company: {
      type: String,
      required: [true, "company is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    type: {
      type: String,
      required: [true, "type is required"],
    },
    level: {
      type: String,
      required: [true, "level is required"],
    },
    department: {
      type: String,
      required: [true, "department is required"],
    },
   
  },
  { timestamps: true }
);

const Jobs = mongoose.models.Jobs || mongoose.model<IJobs>("Jobs", JobsSchema);
export default Jobs;
