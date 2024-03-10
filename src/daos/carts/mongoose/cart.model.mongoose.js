import { Schema } from "mongoose";

export const cartSchema = new Schema(
  {
    _id: { type: String},
    userId: { type: String, ref: "usersSchema", required: true },
    products: [
      {
        _id: { type: String, ref: "productsSchema"},
        quantity: { type: Number, required: true },
      },
    ],
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
