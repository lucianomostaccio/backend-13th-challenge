import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

export const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    userId: { type: String, ref: "User", required: true },
    products: [
      {
        _id: { type: String, default: randomUUID },
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
