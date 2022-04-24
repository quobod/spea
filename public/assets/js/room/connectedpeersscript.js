import * as elements from "./connectedpeersscriptelements.js";
import { addClickHandler, log } from "../utils.js";
import {
  updateSocketUser,
  registerSocketEvents,
  hideMe,
  participantDisconnected,
} from "./wss.js";

// init socket connection
const socket = io("/");

const start = () => {
  console.log(`\n\t\tLanded on the room view\n`);
  registerSocketEvents(socket);
};

start();

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
});

// Click Handlers

addClickHandler(elements.hideMeCheckbox, (e) => {
  hideMe({ userId: elements.rmtIdInput.value, show: e.target.checked });
});
