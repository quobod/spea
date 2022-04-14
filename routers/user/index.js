import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  userDashboard,
  viewUserProfile,
  userReauth,
  updateUserProfile,
  userRoom,
  joinRoom,
  joinAsPeer,
} from "../../controllers/user/index.js";
import { signedIn, reauthorize } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

const user = Router();

user.route("/").get(signedIn, userDashboard);

user.route("/profile").get(reauthorize, viewUserProfile).post(userReauth);

user.route("/profile/update").post(updateUserProfile);

user.route("/room").get(signedIn, userRoom);

user.route("/room/join").post(signedIn, joinRoom);

user.route("/room/join/peer").get(signedIn, joinAsPeer);

export default user;
