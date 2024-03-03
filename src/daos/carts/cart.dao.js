import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { CartDaoMongoose } from "./mongoose/cart.dao.mongoose.js";
import { CartDaoFiles } from "./files/cart.dao.files.js";

import { cartSchema } from "./mongoose/cart.model.mongoose.js";
import Logger from "../../utils/logger.js";

let daoCarts;

if (EXECUTION_MODE === "online") {
  if (!daoCarts) {
    const cartsModel = model("carts", cartSchema);
    daoCarts = new CartDaoMongoose(cartsModel);
    Logger.info("using mongodb persistence - carts");
  }
} else {
  daoCarts = new CartDaoFiles();
  Logger.info("using files persistence - carts");
}

export function getDaoCarts() {
  return daoCarts;
}
