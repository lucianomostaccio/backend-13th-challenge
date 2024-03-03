import { model } from "mongoose";
import { EXECUTION_MODE } from "../../config/config.js";

import { UsersDaoMongoose } from "./mongoose/users.dao.mongoose.js";
import { UsersDaoFiles } from "./files/users.dao.files.js";
import { usersSchema } from "./mongoose/users.model.mongoose.js";
import Logger from "../../utils/logger.js";
const PATH_USERS_FILES = "./files/users.dao.files.js";

let daoUsers;

if (EXECUTION_MODE === "online") {
  if(!daoUsers) {
    const usersModel = model('users', usersSchema)
    daoUsers = new UsersDaoMongoose(usersModel)
    Logger.info('using mongodb persistence - users')
  }
  // const { getDaoMongoose } = await import("./mongoose/users.dao.mongoose.js");
  // getDaoUsers = getDaoMongoose;
} else {
  daoUsers = new UsersDaoFiles(PATH_USERS_FILES)
  Logger.info('using files persistence - users')
}

export function getDaoUsers() {
  return daoUsers
} 