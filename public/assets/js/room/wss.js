import * as store from "./store.js";
import * as elements from "./roomelements.js";
import * as ui from "./ui.js";
import {
  cls,
  log,
  stringify,
  parse,
  removeChildren,
  getElement,
  appendChild,
} from "../utils.js";

let socketIO = null,
  userDetails = {};

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    elements.personalCode.value = socket.id;
    ui.updatePersonalCode(socket.id);

    console.log(`\n\tSuccessfully connected to socket.io server\n`);
  });

  socket.on("updateuserlist", (data) => {
    // console.log(`\n\tUpdated User List: ${JSON.stringify(data)}\n\n`);
    ui.updateUserList(data);
  });

  socket.on("chatrequest", (data) => {
    log(`\n\tReceived chat request. Request Data ${stringify(data)}\n`);

    userDetails = {
      sender: data.sender.uid,
      receiver: socketIO.id,
    };

    const callout = ui.createChatRequestCallout(
      data,
      handleChatAccept,
      handleChatReject,
      handleChatRequestNoResponse
    );

    removeChildren(getElement("callout-parent"));
    appendChild(getElement("callout-parent"), callout);
  });

  socket.on("chatrequested", (data) => {
    log(`\n\tRequested chat ${stringify(data)}`);
    const callout = ui.chatRequestStatus(data);
    removeChildren(getElement("callout-parent"));
    appendChild(getElement("callout-parent"), callout);
  });

  requestRegistration(socket);
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

export const participantDisconnected = (data = null) => {
  if (null != data) {
    log(data);
    socketIO.emit("participantdisconnected", data);
  }
};

export const requestChat = (data) => {
  log(`\n\tChat Request\n\t\t${stringify(data)}`);
  socketIO.emit("sendchatrequest", data);
};

function requestRegistration(socket) {
  if (elements.rmtIdInput) {
    setTimeout(() => {
      const data = {
        socketId: socket.id,
        rmtId: elements.rmtIdInput.value,
        hasCamera: false,
      };
      const mediaDevices = navigator.mediaDevices || null;
      // log(mediaDevices);
      if (mediaDevices != null) {
        data.hasCamera = true;
      }

      socketIO.emit("registerme", data);
    }, 1200);
  }
}

const handleChatAccept = () => {
  userDetails = {
    from: userDetails.receiver,
    to: userDetails.sender,
    response: "accept",
  };
  socketIO.emit("chataccepted", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatReject = () => {
  userDetails = {
    from: userDetails.receiver,
    to: userDetails.sender,
    response: "reject",
  };
  socketIO.emit("chatrejected", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatRequestNoResponse = () => {
  userDetails = { from: userDetails.receiver, to: userDetails.sender };
  socketIO.emit("chatrequestnoresponse", userDetails);
  removeChildren(getElement("callout-parent"));
};
