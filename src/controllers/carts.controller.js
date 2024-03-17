import { cartsService } from "../services/carts.service.js";

export async function getController(req, res, next) {
  try {
    const cart = await cartsService.readOne();
    console.log("cart", res.result(cart));
    res.result(cart);
  } catch (error) {
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    const cart = await cartsService.addCart(req.body);
    res.created(cart);
  } catch (error) {
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const { cartId, productId } = req.params;

    const payload = req.body;

    if (payload.action === "removeProduct" && productId) {
      const updatedCart = await cartsService.deleteProductFromCart(cartId, productId);
      return res.result(updatedCart); 
    }

    const updatedCart = await cartsService.updateCart(cartId, payload);
    res.result(updatedCart);
  } catch (error) {
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const cart = await cartsService.deleteCart(req.body);
    res.delete(cart);
  } catch (error) {
    next(error);
  }
}

// export async function deleteProductFromCartController(req, res, next) {
//   try {
//     const { cartId, productId } = req.params;
//     const updatedCart = await cartsService.deleteProductFromCart(
//       cartId,
//       productId
//     );
//     res.result(updatedCart);
//   } catch (error) {
//     next(error);
//   }
// }
