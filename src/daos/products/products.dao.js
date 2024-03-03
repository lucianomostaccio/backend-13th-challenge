import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { ProductsDaoMongoose } from "./mongoose/products.dao.mongoose.js";
import { ProductsDaoFiles } from "./files/products.dao.files.js";
import { productsSchema } from "./mongoose/products.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_PRODUCTS_FILES = "../../../db/products.json";

let daoProducts;

if (EXECUTION_MODE === "online") {
  if (!daoProducts) {
    const productsModel = model("products", productsSchema);
    daoProducts = new ProductsDaoMongoose(productsModel);
    Logger.info("using mongodb persistence - products");
  }
} else {
  daoProducts = new ProductsDaoFiles(PATH_PRODUCTS_FILES);
  Logger.info("using files persistence - products");
  // getDaoProducts = getDaoFiles;
}

export function getDaoProducts() {
  return daoProducts;
}
