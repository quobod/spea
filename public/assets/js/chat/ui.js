import * as constants from "./constants.js";
import * as elements from "./elements.js";
import * as utils from "../utils.js";
import {
  removeChildren,
  newElement,
  addHandler,
  addAttribute,
  appendChild,
  getElement,
} from "../utils.js";

// ui helper functions

const enableButton = (btn) => {
  btn.disabled = false;
};

const disableButton = (btn) => {
  btn.disabled = true;
};

const getLeftMessage = (message) => {
  const messageContainer = utils.newElement("div");
  const messageParagraph = utils.newElement("p");
  messageParagraph.innerHTML = message;

  utils.addAttribute(messageContainer, "class", "them");

  utils.appendChild(messageContainer, messageParagraph);
  return messageContainer;
};

const getRightMessage = (message) => {
  const messageContainer = utils.newElement("div");
  const messageParagraph = utils.newElement("p");
  messageParagraph.innerHTML = message;

  utils.addAttribute(messageContainer, "class", "me");

  utils.appendChild(messageContainer, messageParagraph);
  return messageContainer;
};

const enableDashboard = () => {
  const dashboadBlur = elements.dashboardBlur;

  if (!dashboadBlur.classList.contains("display-none")) {
    dashboadBlur.classList.add("display-none");
  }
};

const disableDashboard = () => {
  const dashboadBlur = elements.dashboardBlur;
  utils.log(`\n\tDisabling the dashboard\n`);

  if (dashboadBlur.classList.contains("display-none")) {
    dashboadBlur.classList.remove("display-none");
  }
};

const hideElement = (element) => {
  if (!element.classList.contains("display-none")) {
    element.classList.add("display-none");
  }
};

const showElement = (element) => {
  if (element.classList.contains("display-none")) {
    element.classList.remove("display-none");
  }
};

const showChatCallElements = () => {
  const finishChatButtonContainer = elements.finishChatButtonContainer;
  const newMessageContainer = elements.newMessageContainer;

  showElement(finishChatButtonContainer);
  showElement(newMessageContainer);
  disableDashboard();
};

const hideChatCallElements = () => {
  const finishChatButtonContainer = elements.finishChatButtonContainer;
  const newMessageContainer = elements.newMessageContainer;

  hideElement(finishChatButtonContainer);
  hideElement(newMessageContainer);
  enableDashboard();
};

const showVideoCallElements = () => {
  const callButtons = elements.callButtonsContainer;
  const finishChatButtonContainer = elements.finishChatButtonContainer;
  // const videoButtons = elements.videoRecordingButtonsContainer;
  const newMessageContainer = elements.newMessageContainer;
  const remoteVideo = elements.remoteVideo;

  showElement(callButtons);
  showElement(finishChatButtonContainer);
  showElement(remoteVideo);
  // showElement(videoButtons);
  showElement(newMessageContainer);

  disableDashboard();
};

const hideVideoCallElements = () => {
  const callButtons = elements.callButtonsContainer;
  const finishChatButtonContainer = elements.finishChatButtonContainer;
  const videoButtons = elements.videoRecordingButtonsContainer;
  const newMessageContainer = elements.newMessageContainer;
  const remoteVideo = elements.remoteVideo;

  hideElement(callButtons);
  hideElement(finishChatButtonContainer);
  hideElement(remoteVideo);
  hideElement(videoButtons);
  hideElement(newMessageContainer);

  enableDashboard();
};

const noVideoDevice = () => {
  if (elements.localVideoContainer) {
    const localVideoContainer = elements.localVideoContainer;
    const localVideo = elements.localVideo;
    const personalCodeVideoButton = elements.personalCodeVideoButton;
    const strangerCodeVideoButton = elements.strangerCodeVideoButton;
    localVideoContainer.classList.add("hide");
    localVideo.classList.add("hide");
    personalCodeVideoButton.classList.add("hide");
    strangerCodeVideoButton.classList.add("hide");
  }
};

const yesVideoDevice = () => {
  if (elements.localVideoContainer) {
    const localVideoContainer = elements.localVideoContainer;
    const localVideo = elements.localVideo;
    const personalCodeVideoButton = elements.personalCodeVideoButton;
    const strangerCodeVideoButton = elements.strangerCodeVideoButton;

    if (localVideoContainer.classList.contains("hide")) {
      localVideoContainer.classList.remove("hide");
    }

    if (localVideo.classList.contains("hide")) {
      localVideo.classList.remove("hide");
    }

    if (personalCodeVideoButton.classList.contains("hide")) {
      personalCodeVideoButton.classList.remove("hide");
    }

    if (strangerCodeVideoButton.classList.contains("hide")) {
      strangerCodeVideoButton.classList.remove("hide");
    }
  }
};

// Exported functions

export const updateLocalVideo = (stream) => {
  if (elements.localVideo) {
    const localVideo = elements.localVideo;
    localVideo.srcObject = stream;

    utils.addHandler(localVideo, "loadmetadata", () => {
      localVideo.play();
    });
  }
};

export const updateRemoteVideo = (stream) => {
  const remoteVideo = elements.remoteVideo;
  remoteVideo.srcObject = stream;
};

export const updatePersonalCode = (personalCode) => {
  elements.personalCodeParagraph.innerHTML = personalCode;
};

export const showIncomingCallRequest = (
  callType,
  acceptCallHandler,
  rejectCallHandler,
  caller = null
) => {
  const callTypeInfo =
    callType === constants.callType.CHAT_PERSONAL_CODE ? "chat" : "video";

  const incomingCallDialog = elements.getIncomingCallDialog(
    callTypeInfo,
    acceptCallHandler,
    rejectCallHandler,
    caller
  );

  // Remove all dialogs
  const parentDialog = utils.getElement("dialog");
  utils.removeChildren(parentDialog);
  utils.appendChild(parentDialog, incomingCallDialog);
};

export const showCallingDialog = (rejectCallHandler) => {
  const callingDialog = elements.showCallingDialog(rejectCallHandler);

  // Remove all dialogs
  const parentDialog = utils.getElement("dialog");
  utils.removeChildren(parentDialog);
  utils.appendChild(parentDialog, callingDialog);
  utils.appendChild(parentDialog, callingDialog);
};

export const showCallingAlert = (rejectCallHandler) => {
  elements.showCallingAlert(rejectCallHandler);
};

export const removeAllDialogs = () => {
  const dialog = document.querySelector("#dialog");
  utils.removeChildren(dialog);
};

export const showCallElements = (callType) => {
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    showChatCallElements();
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    showVideoCallElements();
  }
};

export const showInfoDialog = (preOfferAnswer, calleeDetails = null) => {
  let infoDialog = null;

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    infoDialog = elements.getInfoDialog(
      "Call rejected",
      `${calleeDetails.calleeFname} rejected your call`
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    infoDialog = elements.getInfoDialog(
      "Callee not found",
      "Please  check personal code"
    );
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    infoDialog = elements.getInfoDialog(
      "Call is not possible",
      "Probably busy try again later"
    );
  }

  if (infoDialog) {
    const dialog = utils.getElement("dialog");
    utils.appendChild(dialog, infoDialog);

    setTimeout(() => {
      removeAllDialogs();
    }, [4000]);
  }
};

export const updateMicButton = (buttonActive) => {
  const enabled = '<i class="fas fa-microphone fa-fw fa-2x"></i>';
  const disabled = '<i class="fas fa-microphone-slash fa-fw fa-2x"></i>';
  elements.micButton.innerHTML = buttonActive ? disabled : enabled;
};

export const updateCameraButton = (cameraActive) => {
  elements.cameraButton.enabled = cameraActive ? true : false;
};

export const appendMessage = (message, right = false) => {
  const messagesContainer = elements.messagesContainer;
  const messageElement = right
    ? getRightMessage(message)
    : getLeftMessage(message);
  utils.appendChild(messagesContainer, messageElement);
};

export const clearMessenger = () => {
  const messagesContainer = elements.messagesContainer;
  utils.removeChildren(messagesContainer);
};

export const hideLocalVideoContainer = () => {
  noVideoDevice();
};

export const showLocalVideoContainer = () => {
  yesVideoDevice();
};

export const showRecordingPanel = () => {
  const videoRecordingButtonsContainer =
    elements.videoRecordingButtonsContainer;
  showElement(videoRecordingButtonsContainer);
  // enableButton(elements.pauseRecordingButton);
  // disableButton(elements.resumeRecordingButton);

  // hide start recording button if it is active
  const startRecordingButton = elements.startRecordingButton;
  hideElement(startRecordingButton);
};

export const resetRecordingButtons = () => {
  const videoRecordingButtonsContainer =
    elements.videoRecordingButtonsContainer;
  hideElement(videoRecordingButtonsContainer);

  // hide start recording button if it is active
  const startRecordingButton = elements.startRecordingButton;
  hideElement(startRecordingButton);
};

export const pauseRecording = () => {
  if (!elements.pauseRecordingButton.classList.contains("display-none")) {
    elements.pauseRecordingButton.classList.add("display-none");
  }

  if (elements.resumeRecordingButton.classList.contains("display-none")) {
    elements.resumeRecordingButton.classList.remove("display-none");
  }
};

export const resumeRecording = () => {
  if (elements.pauseRecordingButton.classList.contains("display-none")) {
    elements.pauseRecordingButton.classList.remove("display-none");
  }

  if (!elements.resumeRecordingButton.classList.contains("display-none")) {
    elements.resumeRecordingButton.classList.add("display-none");
  }
};

export const updateUiAfterHungup = (callType) => {
  console.log(`\n\t\tUpdating the UI after user hangup`);

  enableDashboard();

  if (
    callType === constants.callType.VIDEO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_STRANGER
  ) {
    const callButtonsContainer = elements.callButtonsContainer;
    hideElement(callButtonsContainer);
    hideVideoCallElements();
  } else {
    const chatCallButtons = elements.chatCallButtons;
    hideElement(chatCallButtons);
    hideChatCallElements();
  }

  const newMessageContainer = elements.newMessageContainer;
  hideElement(newMessageContainer);
  clearMessenger();
  updateMicButton(false);
  updateCameraButton(false);

  const remoteVideo = elements.remoteVideo;
  hideElement(remoteVideo);

  removeAllDialogs();
};

export const updateUserList = (data) => {
  if (elements.peersList) {
    const userList = elements.peersList;
    const personalCodeParagraph =
      elements.personalCodeParagraph.innerHTML.trim();
    removeChildren(userList);

    data.forEach((item, index) => {
      if (!item.hide) {
        const divPanel = newElement("div");
        const button = newElement("button");
        const divContent = newElement("div");
        const pFname = newElement("p");
        const pLname = newElement("p");
        const pEmail = newElement("p");

        appendChild(userList, button);
        appendChild(userList, divPanel);
        appendChild(divPanel, divContent);
        appendChild(divContent, pFname);
        appendChild(divContent, pLname);
        appendChild(divContent, pEmail);

        addAttribute(divPanel, "class", "panel");
        addAttribute(divPanel, "style", "z-index: 101;background:transparent;");
        addAttribute(button, "class", "accordion");
        // addAttribute(divContent, "class", "cell small-12");

        button.innerHTML = `${item.fname} ${item.lname}`;
        pEmail.innerHTML = `${item.email}`;
        pFname.innerHTML = `${item.fname}`;
        pLname.innerHTML = `${item.lname}`;

        addHandler(button, "click", () => {
          const panel = button.nextElementSibling;
          button.classList.toggle("active");
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });

        if (item.uid != personalCodeParagraph) {
          const callButton = newElement("button");
          appendChild(divContent, callButton);
          addAttribute(callButton, "class", "button primary");
          addAttribute(callButton, "id", `${item.uid}`);
          callButton.innerHTML = `Call`;

          addHandler(callButton, "click", (e) => {
            const target = e.target;
            console.log(`Target ID: ${target.id}`);
            elements.personalCodeInput.value = `${target.id}`;
          });
        }
      }
    });
  }
};
