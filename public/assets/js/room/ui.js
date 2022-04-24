import * as elements from "./connectedpeersscriptelements.js";
import {
  removeChildren,
  newElement,
  addHandler,
  addAttribute,
  appendChild,
  getElement,
  addClickHandler,
  cap,
} from "../utils.js";
import { chatType } from "../constants.js";
import { requestChat } from "./wss.js";

// Exported functions

export const updatePersonalCode = (id) => (elements.personalCode.value = id);

export const updateUserList = (data) => {
  if (elements.peersList) {
    const userList = elements.peersList;
    const personalCode = elements.personalCode.value;
    const rmtId = elements.rmtIdInput.value;

    removeChildren(userList);

    data.forEach((item, index) => {
      if (!item.hide && item.rmtId != rmtId) {
        // console.log(`\n\tItem: ${JSON.stringify(item)}\n\n`);
        // if (!item.hide) {
        const cell = newElement("div");
        const card = newElement("div");
        const cardDividerHeader = newElement("div");
        const thumbnail = newElement("div");
        const divControls = newElement("div");
        const imgPlaceholder = newElement("i");
        const videoIcon = newElement("i");
        const phoneIcon = newElement("i");
        const paraPeerName = newElement("p");

        // Append Componenets
        appendChild(userList, cell);
        appendChild(cell, card);
        appendChild(card, cardDividerHeader);
        // appendChild(card, cardSectionContent);
        appendChild(card, thumbnail);
        appendChild(card, divControls);
        appendChild(cardDividerHeader, paraPeerName);
        appendChild(thumbnail, imgPlaceholder);

        // Add Attributes
        addAttribute(cell, "class", `cell`);
        addAttribute(card, "class", "card");
        addAttribute(cardDividerHeader, "class", "card-divider");
        addAttribute(thumbnail, "class", "card-section grid-x grid-padding-x");
        addAttribute(divControls, "class", "card-divider");
        addAttribute(thumbnail, "class", "grid-x grid-padding-x align-center");
        addAttribute(
          imgPlaceholder,
          "class",
          "fa-solid fa-user fa-fw fa-3x cell small-12"
        );
        // addAttribute(divControls, "class", "grid-container full");
        addAttribute(videoIcon, "class", "fa-solid fa-video fa-fw fa-2x");
        addAttribute(videoIcon, "id", `${item.rmtId}`);
        addAttribute(phoneIcon, "class", "fa-solid fa-phone fa-fw fa-2x");
        addAttribute(phoneIcon, "id", `${item.rmtId}`);
        addAttribute(paraPeerName, "class", "lead");

        // Add innerHTML
        /* videoIcon.innerHTML = `<b>Video Chat</b>`;
        chatIcon.innerHTML = `<b>Text Chat</b>`; */
        paraPeerName.innerHTML = `<b>${cap(item.fname)}</b>`;

        // if (item.rmtId != rmtId) {
        if (item.hasCamera) {
          appendChild(divControls, videoIcon);
          appendChild(divControls, phoneIcon);

          addClickHandler(videoIcon, (e) => {
            console.log(`\n\tRequesting video chat\n`);
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.VIDEO_CHAT,
            };
            requestChat(data);
          });

          addClickHandler(phoneIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.VOICE_CHAT,
            };
            requestChat(data);
          });
        } else {
          appendChild(divControls);
          appendChild(divControls, phoneIcon);

          addClickHandler(phoneIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.TEXT_CHAT,
            };
            requestChat(data);
          });
        }
      }
    });
  }
};

export const createChatRequestCallout = (
  userDetails,
  handleChatAccept,
  handleChatReject,
  handleChatRequestNoResponse
) => {
  const { sender, requestType } = userDetails;
  const messageCallout = newElement("div");
  const messageBody = newElement("div");
  const controlsDiv = newElement("div");
  const messageHeader = newElement("h5");
  const message = newElement("p");
  const closeButton = newElement("button");
  const rejectButton = newElement("button");
  const acceptButton = newElement("button");
  const span = newElement("span");

  // Attributes
  addAttribute(messageCallout, "class", "callout primary small");
  addAttribute(messageCallout, "data-closable", "");
  addAttribute(closeButton, "class", "close-button");
  addAttribute(closeButton, "aria-label", "Dismiss alert");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "data-close", "");
  addAttribute(span, "aria-hidden", "true");
  addAttribute(controlsDiv, "class", "grid-x grid-margin-x align-center");
  addAttribute(rejectButton, "class", "cell auto button alert");
  addAttribute(acceptButton, "class", "cell auto button success");
  // addAttribute(rejectButton, "style", "width:45%; margin-right:5px;");
  // addAttribute(acceptButton, "style", "width:45%;margin-left:5px;");
  addAttribute(message, "style", "font-size:1.5rem;font-weight:bolder;");

  // Inner HTML
  rejectButton.innerHTML = "Reject";
  acceptButton.innerHTML = "Accept";
  span.innerHTML = `&times;`;
  message.innerHTML = `${cap(sender.fname)} ${cap(
    sender.lname
  )} wants to ${requestType} with you`;

  // Append elements
  appendChild(messageCallout, message);
  appendChild(messageCallout, controlsDiv);
  appendChild(controlsDiv, rejectButton);
  appendChild(controlsDiv, acceptButton);
  appendChild(messageCallout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => {
    messageCallout.remove();
    handleChatRequestNoResponse();
  });
  addClickHandler(rejectButton, handleChatReject);
  addClickHandler(acceptButton, handleChatAccept);

  return messageCallout;
};

export const chatRequestStatus = (data) => {
  const { receiver } = data;
  const callout = newElement("div");
  const h5 = newElement("h5");
  const closeButton = newElement("button");
  const span = newElement("span");

  // Add Attributes
  addAttribute(callout, "class", "callout primary small");
  addAttribute(callout, "data-closable", "");
  addAttribute(closeButton, "class", "close-button");
  addAttribute(closeButton, "aria-label", "");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "data-close", "");
  addAttribute(span, "aria-hidden", "true");

  // innerHTML
  h5.innerHTML = `<b>Calling ${cap(receiver.fname)} ${cap(receiver.lname)}</b>`;
  span.innerHTML = `&times;`;

  // Append elements
  appendChild(callout, h5);
  appendChild(callout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => callout.remove());

  return callout;
};

export const handleChatRequestResponse = (data) => {
  const { response, receiver } = data;
  const callout = newElement("div");
  const h5 = newElement("h5");
  const closeButton = newElement("button");
  const span = newElement("span");
  let responseMessage;

  // Add Attributes
  addAttribute(callout, "class", "callout primary small");
  addAttribute(callout, "data-closable", "");
  addAttribute(closeButton, "class", "close-button");
  addAttribute(closeButton, "aria-label", "");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "data-close", "");
  addAttribute(span, "aria-hidden", "true");

  switch (response.toLowerCase().trim()) {
    case "rejected":
      responseMessage = `${receiver.fname} rejected your call`;
      break;

    default:
      responseMessage = `${receiver.fname} is not available at this time`;
  }

  // innerHTML
  h5.innerHTML = `<b>${responseMessage}</b>`;
  span.innerHTML = `&times;`;

  // Append elements
  appendChild(callout, h5);
  appendChild(callout, closeButton);
  appendChild(closeButton, span);

  // Register click event
  addClickHandler(closeButton, (e) => callout.remove());

  return callout;
};

// Helpers
