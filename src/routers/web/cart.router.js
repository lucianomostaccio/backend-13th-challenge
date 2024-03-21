import { Router } from "express";
import { onlyLoggedInWeb } from "../../middlewares/authorization.js";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", onlyLoggedInWeb, async (req, res) => {
  // Load carts directly, or change it to use a database
  const daoCarts = getDaoCarts();
  const productsInCart = await daoCarts.readOne();

  // @ts-ignore
  const user = req.session["user"];
  // console.log("user in session:", user)
  // console.log("products in cart with json stringify:", productsInCart);

  let total = 0;
  let cartId = null; 
  
  if (productsInCart) {

    productsInCart.products.forEach((product) => {
      total += product.productId.price * product.quantity;
    });
    cartId = productsInCart._id; 
  } else {
    console.log("No cart found for user:", user);
  }

  console.log(JSON.stringify(productsInCart, null, 2));
  res.render("cart.handlebars", {
    welcomeMessage: "Welcome",
    user,
    pageTitle: "Cart",
    products: productsInCart ? productsInCart.products : [], 
    cartId, 
    total,
    style: "cart.css",
  });
});
