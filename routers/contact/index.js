import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  addNewContact,
  searchContacts,
  viewContact,
  editContact,
  deleteContact,
  getContacts,
} from "../../controllers/contacts/index.js";
import { signedIn, reauthorize } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

const contact = Router();

contact.route("/").get(signedIn, getContacts);

contact
  .route("/add")
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

contact
  .route("/contact/:contactId")
  .get(signedIn, viewContact)
  .post(signedIn, editContact);

contact.route(`/search`).post(signedIn, searchContacts);

contact.route("/contact/delete/:contactId").get(signedIn, deleteContact);

export default contact;
