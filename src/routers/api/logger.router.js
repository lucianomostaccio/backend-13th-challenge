import express from "express";
import Logger from "../../utils/logger.js";

const loggerRouter = express.Router();

loggerRouter.get("/", (req, res) => {
  Logger.debug("Test Debug");
  Logger.http("Test HTTP");
  Logger.info("Test Info");
  Logger.warning("Test Warning");
  Logger.error("Test Error");

  res.send("Logger test completed. Check your console and errors.log file.");
});

export default loggerRouter;
