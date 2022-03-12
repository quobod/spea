import * as store from "./store.js";
import * as ui from "./ui.js";
import * as webRTCHandler from "./webrtchandler.js";
import * as constants from "./constants.js";
import * as elements from "./elements.js";

let socketIO = null;
webRTCHandler.getLocalPreview();

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    store.setSocketId(socket.id);
    ui.updatePersonalCode(socket.id);
    console.log(
      `\n\tSuccessfully connected to socket.io server\n\tReceived personal code: ${
        store.getState().socketId
      }`
    );
  });

  socket.on("preoffer", (data) => {
    console.log(
      `\n\tReceived a preoffer event from server\n\tData:\t${JSON.stringify(
        data
      )}`
    );
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("preofferanswer", (data) => {
    console.log(
      `\n\tPre offer answer received\n\tData: ${JSON.stringify(data)}`
    );
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("webrtcsignaling", (data) => {
    switch (data.type) {
      case constants.webRtcSignaling.OFFER:
        webRTCHandler.handleWebRtcOffer(data);
        break;

      case constants.webRtcSignaling.ANSWER:
        webRTCHandler.handleWebRtcAnswer(data);
        break;

      case constants.webRtcSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRtcCandidate(data);
        break;

      default:
        return;
    }
  });

  socket.on("userhungup", () => {
    webRTCHandler.handleConnectedUserHungup();
  });

  socket.on("updateuserlist", (data) => {
    ui.updateUserList(data);
  });

  setTimeout(() => {
    socket.emit("registerme", {
      socketId: socket.id,
      rmtId: elements.rmtUser.value,
    });
  }, [1200]);
};

export const sendPreOffer = (data) => {
  console.log(
    `\n\tEmitting to server preoofer event\n\tData:\t${JSON.stringify(data)}`
  );
  socketIO.emit("preoffer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("preofferanswer", data);
};

export const sendDataUsingWebRtcSignaling = (data) => {
  socketIO.emit("webrtcsignaling", data);
};

export const sendUserHungup = (data) => {
  socketIO.emit("userhungup", data);
};

export const registerMe = (data) => {
  socketIO.emit("registerme", data);
};

export const hideMe = (data = null) => {
  console.log(`\n\thideMe method invoked\n`);
  if (data) {
    socketIO.emit("changevisibility", data);
  }
};
