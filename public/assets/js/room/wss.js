import * as store from "./store.js";
import * as elements from "./roomelements.js";
import * as connectedpeerselements from "./connectedpeersscriptelements.js";
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
    if (connectedpeerselements.personalCode) {
      connectedpeerselements.personalCode.value = socket.id;
    }
    // ui.updatePersonalCode(socket.id);

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
    log(`\n\tchatrequestaccepted method data: ${stringify(data)}`);
    const { senderSocketId, receiverSocketId, type, sender, roomName } = data;
    let xmlHttp, token, chatType;

    if (sender) {
      try {
        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("POST", "/user/room/create");

        xmlHttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        xmlHttp.onload = () => {
          const responseText = xmlHttp.responseText;

          if (responseText) {
            if (responseText.status) {
              log(`\n\tResponse Text: ${stringify(responseText)}\n`);
              const responseJson = parse(responseText);
              token = responseJson.token;

              location.href = `/user/room/join?roomName=${roomName}&chatType=${type}`;
            }
          }
        };

        xmlHttp.send(`chatType=${type}&roomName=${roomName}`);
      } catch (err) {
        log(err);
        return;
      }
    } else {
      xmlHttp = new XMLHttpRequest();

      xmlHttp.onload = () => {
        location.href = `/user/room/join?roomName=${roomName}&chatType=${type}`;
      };

      xmlHttp.open(
        "GET",
        `/user/room/join?roomName=${roomName}&chatType=${type}`
      );

      xmlHttp.send();
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
    log(`\n\tParticiptant disconnected : ${stringify(data)}`);
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
    }, 700);
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
