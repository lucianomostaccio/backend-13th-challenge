import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { CartDaoMongoose } from "./mongoose/cart.dao.mongoose.js";
import { CartDaoFiles } from "./files/cart.dao.files.js";

import { cartSchema } from "./mongoose/cart.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_CARTS_FILES = "../../../db/carts.json";

let daoCarts;

// @ts-ignore
if (EXECUTION_MODE === "online") {
  if (!daoCarts) {
    const cartsModel = model("carts", cartSchema);
    daoCarts = new CartDaoMongoose(cartsModel);
    Logger.info("using mongodb persistence - carts");
    console.log("using mongodb persistence - carts")
  }
} else {
  daoCarts = new CartDaoFiles(PATH_CARTS_FILES);
  Logger.info("using files persistence - carts");
  console.log("using files persistence - carts")
}

export function getDaoCarts() {
  return daoCarts;
}
