import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "./utils.js";

// Contacts View Elements

// Search contacts input field
export const searchInput = document.querySelector("#search-input");

// New contact form
export const contactFname = document.querySelector("#contact-fname");
export const contactLname = document.querySelector("#contact-lname");
export const contactEmail = document.querySelector("#contact-email");
export const contactPhone = document.querySelector("#contact-phone");

// Single contact controls
/* export const contactEditButton = document.querySelector("#contact-edit-button");
export const contactDeleteButton = document.querySelector(
  "#contact-delete-button"
);
export const editContactForm = document.querySelector("#edit-contact-form");
export const addEmailButton = document.querySelector("#add-email");
export const addPhoneButton = document.querySelector("#add-phone"); */

// Messages
export const closeButton = document.querySelector(".close-button");

// Partials
export const newContactForm = document.querySelector("#new-contact-form");
export const searchForm = document.querySelector("#search-form");

// Dialog
export const dialog = document.querySelector("#dialog");

// RMT User ID
export const rmtUserId = document.querySelector("#rmtuserid");

// Personal Code
export const personalCode = document.querySelector("#personal-code");
