import Logger from "../../../utils/logger.js";
import { toPOJO } from "../../utils.js";

export class CartDaoMongoose {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  async create(data) {
    // Ensure data includes userId
    if (!data.userId) {
      throw new Error("UserId is required to create a cart");
    }
    const cart = await this.cartModel.create(data);
    return toPOJO(cart);
  }

  async readOne(query) {
    const cart = await this.cartModel
      .findOne(query)
      .populate({
        path: "products.productId",
        select: "title price description",
      })
      .lean();
    console.log(
      "cart found by cartDaoMongoose:",
      JSON.stringify(cart, null, 2)
    );
    if (!cart) {
      Logger.info("Cart not found with query:", query);
      return null;
    }
    return toPOJO(cart);
  }

  async updateOne(query, data) {
    // Use userId in query if provided
    const updatedCart = await this.cartModel
      .findOneAndUpdate(query, data, { new: true })
      .lean();
    if (!updatedCart) {
      Logger.warning("Cart not found with query:", query);
      return null;
    }
    return toPOJO(updatedCart);
  }

  async deleteOne(query) {
    // Use userId in query if provided
    const deletedCart = await this.cartModel.findOneAndDelete(query).lean();
    if (!deletedCart) {
      Logger.warning("Cart not found with query:", query);
      return null;
    }
    return toPOJO(deletedCart);
  }

  async addProductToCart(userId, productId, quantity = 1) {
    // Find the cart based on userId
    const cart = await this.cartModel.findOne({ userId }).lean();
    if (!cart) {
      Logger.warning("Cart not found for user:", userId);
      // Consider whether you want to create a new cart here if not found
      return null;
    }

    // Update cart's products array
    const productIndex = cart.products.findIndex(
      (product) => product._id === productId
    );
    if (productIndex !== -1) {
      // Product already in cart, update quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // New product for this cart
      cart.products.push({ _id: productId, quantity });
    }

    // Update the cart with the new products array
    const updatedCart = await this.cartModel
      .findOneAndUpdate(
        { userId },
        { $set: { products: cart.products } },
        { new: true }
      )
      .lean();

    if (!updatedCart) {
      Logger.error("Error updating cart for user:", userId);
      throw new Error("Error updating cart");
    }
    Logger.info("Product added to cart for user:", userId);
    return toPOJO(updatedCart);
  }
}
