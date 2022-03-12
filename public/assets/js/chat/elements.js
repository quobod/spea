import { preOfferAnswer } from "./constants.js";
import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "../utils.js";
export const alert = document.querySelector("#alert");
export const alertTitle = document.querySelector("#alert-title");
export const alertBody = document.querySelector("#alert-body");

// Dashboard code components
export const rmtUser = document.querySelector("#rmtuser");
export const personalCodeParagraph = document.querySelector(
  "#personal-code-paragraph"
);
export const personalCodeInput = document.querySelector("#personal-code-input");
export const personalCodeCopyButton = document.querySelector(
  "#personal-code-copy-button"
);
export const personalCodeChatButton = document.querySelector(
  "#personal-code-chat-button"
);
export const personalCodeVideoButton = document.querySelector(
  "#personal-code-video-button"
);
export const strangerCodeChatButton = document.querySelector(
  "#stranger-code-chat-button"
);
export const strangerCodeVideoButton = document.querySelector(
  "#stranger-code-video-button"
);
export const allowStrangersToConnectCheckbox = document.querySelector(
  "#allow-strangers-checkbox"
);
export const dashboardBlur = document.querySelector("#dashboard-blur");

// Call container components
export const localVideoContainer = document.querySelector(
  ".local-video-container"
);
export const videoPlaceholder = document.querySelector("#video-placeholder");
export const remoteVideo = document.querySelector("#remote-video");
export const localVideo = document.querySelector("#local-video");
export const micButton = document.querySelector("#mic-button");
export const cameraButton = document.querySelector("#camera-button");
export const hangupButton = document.querySelector("#hang-up-button");
export const screenSharingButton = document.querySelector(
  "#screen-sharing-button"
);
export const startRecordingButton = document.querySelector(
  "#start-recording-button"
);
export const finishChatButtonContainer = document.querySelector(
  ".finish-chat-button-container"
);
export const finishChatButton = document.querySelector(
  "#finish-chat-call-button"
);
export const pauseRecordingButton = document.querySelector(
  "#pause-recording-button"
);
export const resumeRecordingButton = document.querySelector(
  "#resume-recording-button"
);
export const stopRecordingButton = document.querySelector(
  "#stop-recording-button"
);
export const callButtonsContainer = document.querySelector("#call-buttons");
export const videoRecordingButtonsContainer = document.querySelector(
  ".video-recording-buttons-container"
);
export const chatContainer = document.querySelector(".chat-container");

// Messenger container components
export const sendMessageButton = document.querySelector("#send-message-button");
export const newMessageInput = document.querySelector("#new-message-input");
export const newMessageContainer = document.querySelector(
  ".new-message-container"
);
export const messagesContainer = document.querySelector("#messages-container");

// Dialogs

export const getIncomingCallDialog = (
  callTypeInfo,
  acceptCallHandler,
  rejectCallHandler,
  caller = null
) => {
  console.log(`\n\tReceived call incoming call dialog`);
  const dialogHtml = document.querySelector("#dialog");
  const dialog = newElement("div");
  const dialogContent = newElement("div");
  const title = newElement("p");
  const body = newElement("p");
  const dialogButtonContainer = newElement("div");
  const acceptButton = newElement("button");
  const rejectButton = newElement("button");

  if (
    null != dialog &&
    null != dialogHtml &&
    null != dialogContent &&
    null != title &&
    null != body &&
    null != dialogButtonContainer &&
    null != acceptButton &&
    null != rejectButton
  ) {
    dialog.classList.add("dialog_wrapper");
    dialogContent.classList.add("dialog_content");
    title.classList.add("dialog_title");
    title.innerHTML = `Incoming ${callTypeInfo} Call`;
    body.classList.add("dialog_body");
    body.innerHTML = `From ${caller.fname} ${caller.lname}<br>${caller.email}`;
    dialogButtonContainer.classList.add("dialog_button_container");
    acceptButton.classList.add(`dialog_accept_call_button`);
    rejectButton.classList.add(`dialog_reject_call_button`);

    acceptButton.innerHTML = "Accept Call";
    rejectButton.innerHTML = "Reject Call";

    // register buttons click event
    addHandler(acceptButton, "click", acceptCallHandler);
    addHandler(rejectButton, "click", rejectCallHandler);

    appendChild(dialogButtonContainer, acceptButton);
    appendChild(dialogButtonContainer, rejectButton);
    appendChild(dialogContent, title);
    appendChild(dialogContent, body);
    appendChild(dialogContent, dialogButtonContainer);
    appendChild(dialog, dialogContent);

    return dialog;
  }
  return null;
};

export const showCallingDialog = (rejectCallHandler) => {
  const dialog = newElement("div");
  const dialogContent = newElement("div");
  const title = newElement("p");
  const dialogButtonContainer = newElement("div");
  const hangupCallButton = newElement("button");

  if (
    null != dialog &&
    null != dialogContent &&
    null != title &&
    null != dialogButtonContainer &&
    null != hangupCallButton
  ) {
    dialog.classList.add("dialog_wrapper");
    dialogContent.classList.add("dialog_content");
    title.classList.add("dialog_title");
    dialogButtonContainer.classList.add("dialog_button_container");
    hangupCallButton.classList.add(`dialog_reject_call_button`);

    hangupCallButton.innerHTML = "Hangup the damn Call";
    title.innerHTML = "<h3>Calling</h3>";

    // register buttons click event
    addHandler(hangupCallButton, "click", rejectCallHandler);

    appendChild(dialogButtonContainer, hangupCallButton);
    appendChild(dialogContent, title);
    appendChild(dialogContent, dialogButtonContainer);
    appendChild(dialog, dialogContent);
    return dialog;
  }
};

export const showCallingAlert = (rejectCallHandler) => {
  removeAttribute(alert, "class");
  addAttribute(alert, "class", "callout small success");
  alertTitle.innerHTML = "Calling User";
  alertBody.innerHTML = "Awaiting user's response";
};

export const getInfoDialog = (dialogTitle, dialogDescription) => {
  const dialog = newElement("div");
  const dialogContent = newElement("div");
  const title = newElement("p");
  const description = newElement("p");

  if (
    null != dialog &&
    null != dialogContent &&
    null != title &&
    null != description
  ) {
    dialog.classList.add("dialog_wrapper");
    dialogContent.classList.add("dialog_content");
    title.classList.add("dialog_title");
    description.classList.add("dialog_description");

    title.innerHTML = `<h3>${dialogTitle}</h3>`;
    description.innerHTML = `<h3>${dialogDescription}</h3>`;

    appendChild(dialog, dialogContent);
    appendChild(dialogContent, title);
    appendChild(dialogContent, description);

    return dialog;
  }
};

// Dialog
export const dialog = document.querySelector("#dialog");

// Partials
export const peersList = document.querySelector("#peers-list");
export const newContactForm = document.querySelector("#new-contact-form");
export const controlPanel = document.querySelector("#control-panel");

// Signed In Menu
export const showPresenceInput = document.querySelector("#show-presence-input");
export const showPresence = document.querySelector("#show-presence");
export const peersLink = document.querySelector("#peers-list-link");
export const newContactLink = document.querySelector("#new-contact-link");
export const controlPanelLink = document.querySelector("#control-panel-link");

// Dashboard
export const searchInput = document.querySelector("#search-input");
export const hideCheckbox = document.querySelector("#hide-checkbox");

// New contact form
export const contactFname = document.querySelector("#contact-fname");
export const contactLname = document.querySelector("#contact-lname");
export const contactEmail = document.querySelector("#contact-email");
export const contactPhone = document.querySelector("#contact-phone");

// Contact
export const contactEditButton = document.querySelector("#contact-edit-button");
export const contactDeleteButton = document.querySelector(
  "#contact-delete-button"
);
export const editContactForm = document.querySelector("#edit-contact-form");
export const addEmailButton = document.querySelector("#add-email");
export const addPhoneButton = document.querySelector("#add-phone");

// Profile
export const editProfileForm = document.querySelector("#edit-profile-form");

// Messages
export const closeButton = document.querySelector(".close-button");
