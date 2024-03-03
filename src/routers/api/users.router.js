//register
// Import necessary modules
import { Router } from "express";
import {
  getController,
  postController,
  deleteController,
  putController,
} from "../../controllers/users.controller.js";
import { getDaoUsers } from "../../daos/users/users.dao.js";
import { createHash } from "../../utils/hashing.js";
import { onlyLoggedInRest } from "../../middlewares/authorization.js";
import { extractFile } from "../../middlewares/multer.js";
import Logger from "../../utils/logger.js";

// Create the router
export const usersRouter = Router();

// Handle user registration (POST /api/users/)
usersRouter.post("/", extractFile("profile_picture"), async (req, res) => {
  //put exact name assigned in form to picture field
  try {
    // Hash the password
    req.body.password = createHash(req.body.password);
    Logger.debug(
      "Hashed password for new user registration:",
      req.body.password
    );

    // Set the profile picture path based on the uploaded file
    if (req.file) {
      req.body.profile_picture = req.file.path;
    }

    // Use the postController to handle user creation
    await postController(req, res);
  } catch (error) {
    // Handle errors
    Logger.error("Error in user registration:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
});

usersRouter.get("/current", onlyLoggedInRest, getController);

// Update user password (PUT /api/users/resetpass)
usersRouter.put("/resetpass", async function (req, res) {
  try {
    // Hash the new password
    req.body.password = createHash(req.body.password);

    // Adapt putController to handle password change specifically
    const updatedUser = await putController(req, res);
    Logger.info("User password updated");

    // Successful response
    res.json({
      status: "success",
      payload: updatedUser,
      message: "password updated",
    });
  } catch (error) {
    // Handle errors
    Logger.error("Error updating user password:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
});

// Update user profile information (PUT /api/users/edit)
usersRouter.put(
  "/edit",
  extractFile("profile_picture"),
  async function (req, res) {
    try {
      // Update user information
      const updateFields = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
      };

      if (req.file) {
        updateFields.profile_picture = req.file.path;
      }

      // @ts-ignore
      const updatedUser = await getDaoUsers.updateOne(
        { email: req.body.email },
        { $set: updateFields },
        { new: true }
      );

      Logger.info(req.body.profile_picture);

      // Handle case where user does not exist
      if (!updatedUser) {
        Logger.warn("User not found for update:", { email: req.body.email });
        return res
          .status(404)
          .json({ status: "error", message: "user not found" });
      }

      // Successful response
      Logger.info("User information updated:", { userId: updatedUser._id });
      res.json({
        status: "success",
        payload: updatedUser,
        message: "user information updated",
      });
    } catch (error) {
      // Handle errors
      Logger.error("Error updating user information:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }
);

usersRouter.delete("/:id", deleteController);
