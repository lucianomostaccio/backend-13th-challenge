// @ts-nocheck
import Logger from "../../../utils/logger.js";
import { toPOJO } from "../../utils.js";

export class CartDaoMongoose {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  async create(data) {
    const cart = await this.cartModel.create(data);
    return toPOJO(cart);
  }

  async readOne(query) {
    const cart = await this.cartModel.findOne(query).lean();
    return toPOJO(cart);
  }

  async readMany(query) {
    return toPOJO(await this.cartModel.find(query).lean());
  }

  async updateOne(query, data) {
    const updatedCart = await this.cartModel
      .findOneAndUpdate(query, data, { new: true })
      .lean();
    if (!updatedCart) {
      throw new Error("Cart not found");
    }
    return toPOJO(updatedCart);
  }

  async deleteOne(query) {
    const deletedCart = await this.cartModel.findOneAndDelete(query).lean();
    if (!deletedCart) {
      throw new Error("Cart not found");
    }
    return toPOJO(deletedCart);
  }

  // Método específico para agregar producto a un carrito
  async addProductToCart(userId, productId, quantity = 1) {
    try {
      const cart = await this.cartModel.findOne({ userId }).lean();
      if (!cart) {
        throw new Error("Cart not found for this user");
      }

      const productIndex = cart.products.findIndex(
        (product) => product._id === productId
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ _id: productId, quantity });
      }

      await this.cartModel.updateOne(
        { userId },
        { $set: { products: cart.products } }
      );
      Logger.info("Product added to cart for user:", userId);
    } catch (error) {
      Logger.error("Error adding product to cart:", error);
      throw error;
    }
  }
}
