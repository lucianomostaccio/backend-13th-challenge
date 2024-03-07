// import { Cart } from "../../models/carts.model.js";
import { getDaoCarts } from "../daos/carts/cart.dao.js";
import Logger from "../utils/logger.js";

const cartsDao = getDaoCarts();

class CartsService {
  // Load carts from the database
  async loadCartsFromDatabase() {
    return await cartsDao.readMany();
  }

  // Save all carts to the database
  async saveCartsToDatabase() {
    try {
      await cartsDao.insertMany();
      Logger.info("Carts saved to the database successfully.");
    } catch (err) {
      Logger.error("Error saving carts to the database:", err);
    }
  }

  // Add cart to the database
  async addCart(cartData) {
    return await cartsDao.create(cartData);
  }

  // Get cart by ID
  async getCart(_id) {
    return await cartsDao.readOne({ _id });
  }

  // Add product to a specific cart
  async addProductToCart(userId, productId) {
    // First, find the user's cart by userId
    let cart = await cartsDao.readOne({ userId });
    console.log("cart already exists for user:", cart);

    if (!cart) {
    cart = await cartsDao.create({ userId, products: [] });
    console.log("New cart created for user:", userId);
    Logger.info("New cart created for user:", userId);
    }

    // Find if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (product) => product._id === productId
    );

    if (productIndex !== -1) {
      // The product already exists in the cart, increment its quantity
      cart.products[productIndex].quantity += 1;
    } else {
      // The product is new to the cart, add it with an initial quantity of 1
      cart.products.push({ _id: productId, quantity: 1 });
    }

    // Update the cart in the database
    await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );
    Logger.debug("Product added to the cart for user:", userId);

    return cart;
  }
}

export const cartsService = new CartsService();
