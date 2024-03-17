import fs from "fs/promises";
import Logger from "../../../utils/logger.js";

export class CartDaoFiles {
  constructor(path) {
    this.path = path;
  }

  async #readCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      Logger.error("Error reading carts from file:", err);
      return [];
    }
  }

  async #writeCarts(carts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      Logger.info("Carts written to file successfully.");
    } catch (err) {
      Logger.error("Error writing carts to file:", err);
    }
  }

  async create(cartData) {
    const carts = await this.#readCarts();
    const newCart = { ...cartData, id: Date.now() }; // Utiliza el timestamp como ID para simplicidad
    carts.push(newCart);
    await this.#writeCarts(carts);
    Logger.info("Cart created:", newCart);
    return newCart;
  }

  async readOne(id) {
    const carts = await this.#readCarts();
    const cart = carts.find((cart) => cart.id === id);
    return cart || null;
  }

  async updateOne(id, data) {
    const carts = await this.#readCarts();
    const index = carts.findIndex((cart) => cart.id === id);
    if (index === -1) {
      throw new Error("Cart not found");
    }
    carts[index] = { ...carts[index], ...data };
    await this.#writeCarts(carts);
    Logger.info("Cart updated:", carts[index]);
    return carts[index];
  }

  async deleteOne(id) {
    const carts = await this.#readCarts();
    const index = carts.findIndex((cart) => cart.id === id);
    if (index === -1) {
      throw new Error("Cart not found");
    }
    const [deletedCart] = carts.splice(index, 1);
    await this.#writeCarts(carts);
    Logger.info("Cart deleted:", deletedCart);
    return deletedCart;
  }
}
