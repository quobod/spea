import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "./utils.js";

export const rmtUser = document.querySelector("#rmtuser");

// Dialog
export const dialog = document.querySelector("#dialog");

// Partials
export const newContactForm = document.querySelector("#new-contact-form");
export const searchForm = document.querySelector("#search-form");

// Page Links
export const newContactLink = document.querySelector("#new-contact-link");
export const searchLink = document.querySelector("#search-form-link");

// Dashboard
export const searchInput = document.querySelector("#search-input");
export const personalCode = document.querySelector("#personal-code");

// New contact form
export const contactFname = document.querySelector("#contact-fname");
export const contactLname = document.querySelector("#contact-lname");
export const contactEmail = document.querySelector("#contact-email");
export const contactPhone = document.querySelector("#contact-phone");

// Contact
export const contactEditButton = document.querySelector("#contact-edit-button");
export const contactDeleteButton = document.querySelector(
  "#contact-delete-button"
);
export const editContactForm = document.querySelector("#edit-contact-form");
export const addEmailButton = document.querySelector("#add-email");
export const addPhoneButton = document.querySelector("#add-phone");

// Profile
export const editProfileForm = document.querySelector("#edit-profile-form");

// Messages
export const closeButton = document.querySelector(".close-button");

// Room elements
export const rmtIdInput = document.querySelector("#rmtid-input");
export const controlPanel = document.querySelector("#control-panel");
export const controlPanelLink = document.querySelector("#control-panel-link");
