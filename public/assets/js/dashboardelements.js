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
export const controlPanel = document.querySelector("#control-panel");

// Signed In Menu
export const showPresenceInput = document.querySelector("#show-presence-input");
export const showPresence = document.querySelector("#show-presence");
export const newContactLink = document.querySelector("#new-contact-link");
export const controlPanelLink = document.querySelector("#control-panel-link");

// Dashboard
export const searchInput = document.querySelector("#search-input");
export const hideCheckbox = document.querySelector("#hide-checkbox");
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

// Peers
export const peersList = document.querySelector("#peers-list");
export const peersLink = document.querySelector("#peers-list-link");

// Settings
export const settings = document.querySelector("#settings");
export const settingsLink = document.querySelector("#settings-link");
export const settingsIcon = document.querySelector("#settings-icon");
export const hideMeCheckbox = document.querySelector("#hide-me-checkbox");
