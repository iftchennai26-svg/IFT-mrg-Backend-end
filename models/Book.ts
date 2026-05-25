import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  name: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  description: string;
}

const BookSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    author: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Duplicate the ID field.
BookSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BookSchema.set("toJSON", {
  virtuals: true,
});

export const Book = (mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema)) as mongoose.Model<IBook>;
