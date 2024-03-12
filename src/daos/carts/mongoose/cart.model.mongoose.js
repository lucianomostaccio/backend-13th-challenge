import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

// Definir un esquema para los elementos dentro de 'products'
const productItemSchema = new Schema(
  {
    productId: { type: String, ref: "products" },
    quantity: { type: Number, required: true },
  },
  { _id: false }
); // Desactiva la generación automática de _id para estos subdocumentos

export const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    userId: { type: String, ref: "users", required: true },
    products: [productItemSchema], // Usar el esquema definido para los elementos de 'products'
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
