import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

// import { CartsDaoMongoose } from "./mongoose/carts.dao.mongoose.js";
// import { CartsDaoFiles } from "./files/carts.dao.files.js";
import { CartManagerFiles } from "./files/carts.dao.files.js";
import { CartManagerMongoose } from "./mongoose/carts.dao.mongoose.js";

import { cartSchema } from "./mongoose/carts.model.mongoose.js";
import Logger from "../../utils/logger.js";


let daoCarts;

if (EXECUTION_MODE === "online") {
  if (!daoCarts) {
    const cartsModel = model("carts", cartSchema);
    daoCarts = new CartManagerMongoose();
    Logger.info("using mongodb persistence - carts");
  }
} else {
  daoCarts = new CartManagerFiles();
  Logger.info("using files persistence - carts");
}

export function getDaoCarts() {
  return daoCarts;
}