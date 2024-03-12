import { Schema } from 'mongoose'
import { randomUUID } from "node:crypto";


export const productsSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    title: { type: String, required: true },
    description: { type: String },
    code: { type: String },
    price: { type: Number },
    status: { type: Boolean, default: true },
    stock: { type: Number },
    category: { type: String },
    thumbnails: [{ type: String }], //array of picture paths
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
