import * as store from "./store.js";
import * as elements from "./roomelements.js";
import * as ui from "./ui.js";
import { cls, log, stringify, parse } from "../utils.js";

let socketIO = null;

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    store.setSocketId(socket.id);
    if (elements.personalCode) {
      ui.updatePersonalCode(socket.id);
    }
    console.log(
      `\n\tSuccessfully connected to socket.io server\n\tReceived personal code: ${
        store.getState().id
      }`
    );
  });

  socket.on("updateuserlist", (data) => {
    console.log(`\n\tUpdated User List: ${JSON.stringify(data)}\n\n`);
    ui.updateUserList(data);
  });

  if (elements.rmtIdInput) {
    setTimeout(() => {
      socket.emit("registerme", {
        socketId: socket.id,
        rmtId: elements.rmtIdInput.value,
      });
    }, 1200);
  }
};

export const hideMe = (data = null) => {
  console.log(`\n\thideMe method invoked\n`);
  if (data) {
    socketIO.emit("changevisibility", data);
  }
};

export const updateSocketUser = (data = null) => {
  if (null != data) {
    log(`\n\tUpdate dating socket user store with ${stringify(data)}\n`);
    socketIO.emit("participant", data);
  }
};
