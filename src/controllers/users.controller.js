import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";

// all controllers use Service's functions. In this case, usersService

export async function getController(req, res, next) {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

// register
export async function postController(req, res, next) {
  try {
    Logger.debug("Entered postController");
    const user = await usersService.addUser(req.body);
    Logger.info("User created by postController:", user);
    // res.result(user);
    res.created(user);
  } catch (error) {
    Logger.error("Error in postController:", error);
    next(error);
  }
}

//update
export async function putController(req, res, next) {
  try {
    const userId = req.params.userId || req.session.user._id; // Asume que el ID del usuario está en la sesión o parámetros
    const updateFields = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
    };

    if (req.file) {
      updateFields.profile_picture = req.file.path;
    }

    const updatedUser = await usersService.updateUser(userId, updateFields);
    res.json({
      status: "success",
      payload: updatedUser,
      message: "User information updated",
    });
  } catch (error) {
    Logger.error("Error updating user information:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}
//   try {
//     const userId = req.params.userId;

//     // 1. Check for Password Change Intent:
//     if (req.body.password) {
//       // Handle password change with specific logic
//       const updatedUser = await usersService.updatePassword(
//         userId,
//         req.body.password
//       );
//       res.updated(updatedUser);
//     } else {
//       // 2. General Profile Updates:
//       const updatedUser = await usersService.updateUser(userId, req.body);
//       res.updated(updatedUser);
//     }
//   } catch (error) {
//     next(error);
//   }
// }

// remove
export async function deleteController(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id);
    res.deleted();
  } catch (error) {
    next(error);
  }
}
