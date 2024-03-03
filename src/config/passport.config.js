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
        Logger.debug(`Attempting to log in with email: ${username}`); 
        try {
          const usersDao = getDaoUsers();
          const user = await usersDao.readOne({ email: username });
          Logger.debug("User found by email:", user); 

          if (!user) {
            Logger.warning("User does not exist for email:", username); 
            return done(null, false, { message: "User does not exist" });
          }

          if (!isValidPassword(password, user.password)) {
            Logger.warning("Invalid password for user:", username); 
            return done(null, false, { message: "Invalid password" });
          }

          Logger.info("Login successful for user:", username); 
          return done(null, user);
        } catch (error) {
          Logger.error("Error during login process:", error); 
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    Logger.debug("Serializing user:", user);
    // @ts-ignore
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    Logger.debug(`Deserializing user with ID: ${id}`);
    try {
      const usersDao = getDaoUsers();
      const user = await usersDao.readOne({ _id: id });
      Logger.debug("User found by ID during deserialization:", user);
      done(null, user);
    } catch (error) {
      Logger.error("Error during deserialization:", error); 
      done(error);
    }
  });
};

export default initializePassport;
