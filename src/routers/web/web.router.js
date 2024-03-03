import { Router } from "express";
import { webProductsRouter } from "./products.router.js";
import { webUsersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import Logger from "../../utils/logger.js";

export const webRouter = Router();

webRouter.use(webProductsRouter);
webRouter.use(webUsersRouter);
webRouter.use(sessionsRouter);

webRouter.get("/", (req, res) => {
  Logger.debug("Root route accessed");
  if (req.session["user"]) {
    Logger.info("User is logged in, redirecting to /profile");
    res.redirect("/profile"); // If the user is logged in, redirect to /profile
  } else {
    Logger.info("User not logged in, redirecting to /login");
    res.redirect("/login"); // If the user is not logged in, redirect to /login
  }
});
