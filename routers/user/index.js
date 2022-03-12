import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  userDashboard,
  addNewContact,
  searchContacts,
  viewContact,
  editContact,
  deleteContact,
  viewUserProfile,
  userReauth,
  updateUserProfile,
} from "../../controllers/user/index.js";
import { signedIn, reauthorize } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

const user = Router();

user.route("/dashboard").get(signedIn, userDashboard);

user
  .route("/contacts/add")
  .post(
    signedIn,
    [
      body("email").isEmail().withMessage("Must provide a valid email"),
      body("phone").isMobilePhone(),
      body("fname").notEmpty().withMessage("Must provide a first name"),
      body("lname").notEmpty().withMessage("Must provide a last name"),
    ],
    addNewContact
  );

user
  .route("/contacts/contact/:contactId")
  .get(signedIn, viewContact)
  .post(signedIn, editContact);

user.route(`/contacts/search`).post(signedIn, searchContacts);

user.route("/contacts/contact/delete/:contactId").get(signedIn, deleteContact);

user.route("/profile").get(reauthorize, viewUserProfile).post(userReauth);

user.route("/profile/update").post(updateUserProfile);

export default user;
