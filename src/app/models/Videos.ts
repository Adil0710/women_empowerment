import mongoose, { Schema, Document } from "mongoose";

export interface IVideos extends Document {
  link: string;
}

const VideosSchema = new Schema<IVideos>(
  {
    link: {
      type: String,
      required: [true, "link is required"],
    },
  },
  { timestamps: true }
);

const Videos =
  mongoose.models.Videos || mongoose.model<IVideos>("Videos", VideosSchema);
export default Videos;
