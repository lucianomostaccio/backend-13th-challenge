import { connect as connectToMongoose } from "mongoose";
import { EXECUTION_MODE, MONGODB_CNX_STR } from "../config/config.js";
import Logger from "../utils/logger.js";

// initialize server
export async function connect() {
  if (EXECUTION_MODE === "online") {
    try {
      // @ts-ignore
      await connectToMongoose(MONGODB_CNX_STR);
      Logger.info(`connected to DB: "${MONGODB_CNX_STR}"`);
    } catch (error) {
      Logger.error("Error connecting to DB:", error);
    }
  } else {
    Logger.info("working with local files persistence");
  }
}
