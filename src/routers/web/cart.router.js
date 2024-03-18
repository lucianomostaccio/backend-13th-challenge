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
  let cartId = null; // Inicializar cartId como null

  if (productsInCart) {
    // Si productsInCart no es null, calcular el total y obtener cartId
    productsInCart.products.forEach((product) => {
      total += product.productId.price * product.quantity;
    });
    cartId = productsInCart._id; // Obtener cartId solo si productsInCart existe
  } else {
    // Si no hay carrito, podrías querer inicializar uno o manejar de otra manera
    console.log("No cart found for user:", user);
    // Opcional: Inicializar un carrito vacío para el usuario
  }

  console.log(JSON.stringify(productsInCart, null, 2));
  res.render("cart.handlebars", {
    welcomeMessage: "Welcome",
    user,
    pageTitle: "Cart",
    products: productsInCart ? productsInCart.products : [], // Usar un array vacío si no hay carrito
    cartId, // Pasar cartId, que será null si no hay carrito
    total,
    style: "cart.css",
  });
});
