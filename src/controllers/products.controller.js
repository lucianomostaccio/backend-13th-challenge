import { cartsService } from "../services/carts.service.js";
import { usersService } from "../services/index.js";
import { productsService } from "../services/products.service.js";

export async function getController(req, res, next) {
  try {
    console.log("accesed get products controller")
    // const product = await productsService.getProducts()
    const product = await productsService.readMany({});
    console.log("products obtained using getController:",res.result(product))
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
  console.log("product id obtained in controller", pid)
  
  try {
    const user = await usersService.getUserByEmail(req.session.user.email)
    console.log("user id:",user._id)
    await cartsService.addProductToCart(user._id, pid);

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
