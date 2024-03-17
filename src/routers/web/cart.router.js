import { Router } from "express";
import { onlyLoggedInWeb } from "../../middlewares/authorization.js";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", onlyLoggedInWeb, async (req, res) => {
  // Load carts directly, or change it to use a database
  const daoCarts = getDaoCarts();
  const productsInCart = await daoCarts.readOne();

  const user = req.session["user"];
  // console.log("user in session:", user)
  // console.log("products in cart with json stringify:", productsInCart);

  let total = 0;
  if (productsInCart && productsInCart.products) {
    // Calculate the total price of the cart
    productsInCart.products.forEach((product) => {
      total += product.productId.price * product.quantity; // Ensure you have product prices and quantities
    });
  }

  const cartId = productsInCart._id;
  console.log("cart id:", cartId);

  console.log(JSON.stringify(productsInCart, null, 2));
  res.render("cart.handlebars", {
    welcomeMessage: "Welcome",
    user,
    pageTitle: "Cart",
    products: productsInCart.products,
    cartId,
    total,
    style: "cart.css",
  });
});
