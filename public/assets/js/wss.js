import * as store from "./store.js";
import * as elements from "./elements.js";
import * as ui from "./ui.js";

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
    ui.updateUserList(data);
  });

  if (elements.rmtUser) {
    setTimeout(() => {
      socket.emit("registerme", {
        socketId: socket.id,
        rmtId: elements.rmtUser.value,
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
