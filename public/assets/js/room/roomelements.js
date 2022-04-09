import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "../utils.js";

// Dialog
export const dialog = document.querySelector("#dialog");
export const calloutParent = document.querySelector("#callout-parent");

// Messages
export const closeButton = document.querySelector(".close-button");

// Peers
export const peersList = document.querySelector("#peers-list");
export const peersLink = document.querySelector("#peers-list-link");

// Room elements
export const rmtIdInput = document.querySelector("#rmtid-input");
export const personalCode = document.querySelector("#personal-code");
export const joinRoomInput = document.querySelector("#join-room-input");
export const roomNameInput = document.querySelector("#room-name-input");
export const hideMeCheckbox = document.querySelector("#hide-me-checkbox");

// Room links
export const settings = document.querySelector("#settings");
export const settingsLink = document.querySelector("#settings-link");
export const settingsIcon = document.querySelector("#settings-icon");
export const showPresenceInput = document.querySelector("#show-presence-input");
export const showPresence = document.querySelector("#show-presence");
export const controlPanel = document.querySelector("#control-panel");
export const controlPanelLink = document.querySelector("#control-panel-link");
