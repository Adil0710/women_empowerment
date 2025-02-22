import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  description: string;
  link: string;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: [true, "title is required"] },

    description: {
      type: String,
      required: [true, "description is required"],
    },

    link: {
      type: String,
      required: [true, "link is required"],
    },
  },
  { timestamps: true }
);

const Article =
  mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
export default Article;
