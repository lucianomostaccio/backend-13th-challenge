import { Cart } from "../models/carts.model.js";
import { getDaoCarts } from "../daos/carts/cart.dao.js";
import Logger from "../utils/logger.js";

const cartsDao = getDaoCarts();

class CartsService {
  // Add cart to the database
  async addCart(cartData) {
    const cart = new Cart(cartData);
    const savedCart = await cartsDao.create(cart.toPOJO());
    return savedCart;
  }

  
  async readOne() {
    return await cartsDao.readOne();
  }

  // Get cart by ID
  async readOneById(id) {
    return await cartsDao.readOne({ _id: id });
  }

  // Add product to a specific cart
  async addProductToCart(userId, productId) {
    // First, find the user's cart by userId
    let cart = await cartsDao.readOne({ userId });
    console.log("Cart before adding product:", cart);

    // If the cart doesn't exist, create a new one for the user
    if (!cart) {
      cart = await cartsDao.create({ userId, products: [] });
      console.log("New cart created for user:", userId);
    }

    // Diagnostic logging to see the product ID being added
    console.log("Attempting to add product with ID:", productId);

    // Find if the product already exists in the cart
    const productIndex = cart.products.findIndex((product) => {
      // Diagnostic logging for comparison
      console.log("Comparing with product in cart with ID:", product.productId);
      return product.productId._id === productId;
    });

    // If the product is found in the cart, increment its quantity
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      // If the product is new to the cart, add it with an initial quantity of 1
      cart.products.push({ productId: productId, quantity: 1 });
    }

    // Update the cart in the database
    await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );
    console.log("Product added to the cart");
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const update = {
        $pull: { products: { productId: productId } }
      };
  
      const updatedCart = await cartsDao.updateOne({ _id: cartId }, update);
  
      if (!updatedCart) {
        throw new Error("Failed to remove product from cart");
      }
  
      return updatedCart;
    } catch (error) {
      Logger.error("Error removing product from cart:", error);
      throw error;
    }
  }
  


  // Update cart by ID
  async updateCart(_id, updatedCart) {
    try {
      const cartToUpdate = await cartsDao.readOne({ _id });

      if (!cartToUpdate) {
        Logger.warning("Cart not found for update", { _id });
        return null;
      }

      Object.assign(cartToUpdate, updatedCart);

      await cartsDao.updateOne({ _id }, cartToUpdate);
      Logger.info("Cart updated:", cartToUpdate);
      return cartToUpdate;
    } catch (error) {
      Logger.error("Error updating cart:", error);
      throw error;
    }
  }

  // Delete cart by ID
  async deleteCart(_id) {
    try {
      const deletedCart = await cartsDao.deleteOne({ _id });

      if (deletedCart) {
        Logger.info("Product deleted:", deletedCart);
        return deletedCart;
      } else {
        Logger.error("Cart not found for deletion");
        return null;
      }
    } catch (error) {
      Logger.error("Error deleting cart:", error);
      throw error;
    }
  }

}

export const cartsService = new CartsService();
