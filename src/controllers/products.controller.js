import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.service.js";

export async function getController(req, res, next) {
  try {
    // const product = await productsService.getProducts()
    const product = await productsService.readMany({});
    res.result(product);
  } catch (error) {
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    const product = await productsService.addProduct(req.body);
    res.created(product);
  } catch (error) {
    next(error);
  }
}

export async function addToCartController(req, res, next) {
  const { pid } = req.params;
  const userId = req.session.user._id;

  try {
    await cartsService.addProductToCart(userId, pid);
    res.status(200).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    res.status(500).send("Error adding product to cart");
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const productId = req.params.productId;
    const updatedProduct = await productsService.updateProduct(
      productId,
      req.body
    );
    res.result(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const product = await productsService.deleteProduct(req.body);
    res.delete(product);
  } catch (error) {
    next(error);
  }
}

// export async function putController(req, res, next) {
//   try {
//     const product = await productsService.updateProduct(req.body)
//     res.delete(product)
//   } catch (error) {
//     next(error)
//   }
// }
