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
      senderSocketId: data.sender.socketId,
      receiverSocketId: socketIO.id,
      type: data.requestType,
    };

    log(`\n\tUser Details: ${stringify(userDetails)}\n`);

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

    userDetails = {
      receiverSocketId: data.receiver.socketId,
      senderSocketId: socketIO.id,
      type: data.requestType,
    };

    log(`\n\tUser Details: ${stringify(userDetails)}\n`);

    const callout = ui.chatRequestStatus(data);
    removeChildren(getElement("callout-parent"));
    appendChild(getElement("callout-parent"), callout);
  });

  socket.on("chatrejected", (data) => {
    const { response, receiver } = data;
    handleResponse(data);
  });

  socket.on("noresponse", (data) => {
    const { response, receiver } = data;
    handleResponse(data);
  });

  socket.on("chatrequestaccepted", (data) => {
    const { senderSocketId, receiverSocketId, type } = data;
    let xmlHttp;

    try {
      xmlHttp = new XMLHttpRequest();

      xmlHttp.open("POST", "/user/room/join");

      xmlHttp.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      );

      xmlHttp.onload = () => {
        location.href = "/user/room/join";
      };

      xmlHttp.send({ type: type });
    } catch (err) {
      log(err);
      location.href = "/user/room/join";
      return;
    }
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
  userDetails.response = "accept";
  socketIO.emit("chataccepted", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatReject = () => {
  userDetails.response = "reject";
  socketIO.emit("chatrejected", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatRequestNoResponse = () => {
  userDetails.response = "noresponse";
  socketIO.emit("chatrequestnoresponse", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleResponse = (data) => {
  const callout = ui.handleChatRequestResponse(data);
  removeChildren(getElement("callout-parent"));
  appendChild(getElement("callout-parent"), callout);
};
