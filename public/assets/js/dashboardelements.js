import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "./utils.js";

export const rmtUserId = document.querySelector("#rmtuser");

// Dialog
export const dialog = document.querySelector("#dialog");
export const closeButton = document.querySelector(".close-button") || null;

// Page Links
export const newContactLink = document.querySelector("#new-contact-link");
export const searchLink = document.querySelector("#search-form-link");

export const controlPanel = document.querySelector("#control-panel");
export const controlPanelLink = document.querySelector("#control-panel-link");
