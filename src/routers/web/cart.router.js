import { Router } from "express";
import { onlyLoggedInWeb } from "../../middlewares/authorization.js";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", onlyLoggedInWeb, async (req, res) => {
  // Load carts directly, or change it to use a database
  const daoCarts = getDaoCarts();
  const productsInCart = await daoCarts.readMany();
  console.log("products in cart:", productsInCart)
  res.render("cart.handlebars", {
    welcomeMessage: "Welcome",
    ...req.session["user"],
    pageTitle: "Cart",
    productsInCart,
    style: "cart.css",
  });
});
