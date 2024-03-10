import { cartsService } from "../services/carts.service.js";

export async function getController(req, res, next) {
  try {
    // const cart = await cartsService.getCarts()
    const cart = await cartsService.getCart({});
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
    const { cartId } = req.params;
    const updatedCart = await cartsService.updateCart(cartId, req.body);
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