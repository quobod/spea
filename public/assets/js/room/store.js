import { log, cls, cap } from "../utils.js";

let contacts = {},
  socket = {};

// Socket

export const setSocketId = (sid) => {
  if ("id" in socket) {
    if (socket.id === sid) {
      log(`\n\tSocket already registered: ${sid}`);
      return;
    } else {
      socket.id = sid;
      log(`\n\tsetSocketId method received a new socket ID: ${sid}`);
    }
  } else {
    socket.id = sid;
    log(
      `\n\tsetSocketId method had updated the socket object with socket ID: ${sid}`
    );
  }
};

// Contacts

export const setContactSize = (numberOfContacts) => {
  contacts.size = numberOfContacts;
};

export const getState = (whichStore = "socket") => {
  switch (whichStore.toLocaleLowerCase().trim()) {
    case "socket":
      return socket;

    default:
      return contacts;
  }
};
