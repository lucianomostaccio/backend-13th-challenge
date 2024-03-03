import passport from "passport";
import local from "passport-local";
import { getDaoUsers } from "../daos/users/users.dao.js";
import { isValidPassword } from "../utils/hashing.js";
import Logger from "../utils/logger.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        Logger.debug(`Attempting to log in with email: ${username}`); // Reemplazado por Logger.debug
        try {
          const usersDao = getDaoUsers();
          const user = await usersDao.readOne({ email: username });
          Logger.debug("User found by email:", user); // Reemplazado por Logger.debug

          if (!user) {
            Logger.warn("User does not exist for email:", username); // Reemplazado por Logger.warn
            return done(null, false, { message: "User does not exist" });
          }

          if (!isValidPassword(password, user.password)) {
            Logger.warn("Invalid password for user:", username); // Reemplazado por Logger.warn
            return done(null, false, { message: "Invalid password" });
          }

          Logger.info("Login successful for user:", username); // Reemplazado por Logger.info
          return done(null, user);
        } catch (error) {
          Logger.error("Error during login process:", error); // Reemplazado por Logger.error
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    Logger.debug("Serializing user:", user); // Reemplazado por Logger.debug
    // @ts-ignore
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    Logger.debug(`Deserializing user with ID: ${id}`); // Reemplazado por Logger.debug
    try {
      const usersDao = getDaoUsers();
      const user = await usersDao.readOne({ _id: id });
      Logger.debug("User found by ID during deserialization:", user); // Reemplazado por Logger.debug
      done(null, user);
    } catch (error) {
      Logger.error("Error during deserialization:", error); // Reemplazado por Logger.error
      done(error);
    }
  });
};

export default initializePassport;
