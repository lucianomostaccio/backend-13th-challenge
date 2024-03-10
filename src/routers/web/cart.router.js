import { Router } from "express";
import { onlyLoggedInWeb } from "../../middlewares/authorization.js";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", onlyLoggedInWeb, async (req, res) => {
  // Load carts directly, or change it to use a database
  const daoCarts = getDaoCarts();
  const productsInCartRaw = await daoCarts.readOne();
  // const productsInCart = JSON.stringify(productsInCartRaw);
  console.log("products in cart:", JSON.stringify(productsInCartRaw, null, 2));
  // console.log("products in cart with json stringify:", productsInCart);
  res.render("cart.handlebars", {
    welcomeMessage: "Welcome",
    ...req.session["user"],
    pageTitle: "Cart",
    // productsInCart,
    productsInCartRaw,
    style: "cart.css",
  });
});
