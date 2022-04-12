import * as elements from "./roomelements.js";
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
    const grid = newElement("div");
    appendChild(userList, grid);
    addAttribute(grid, "class", "grid-x grid-margin-x align-center");

    data.forEach((item, index) => {
      if (!item.hide && item.rmtId != rmtId) {
        const cell = newElement("div");
        const card = newElement("div");
        const cardSection = newElement("div");
        const cardDivider = newElement("div");
        const imgPlaceholder = newElement("div");
        const divContent = newElement("div");
        const divControls = newElement("div");
        const pFname = newElement("p");
        const pLname = newElement("p");
        const pEmail = newElement("p");
        const videoIcon = newElement("i");
        const chatIcon = newElement("i");
        const img = newElement("i");

        // Prepare card
        appendChild(grid, cell);
        appendChild(cell, card);
        appendChild(card, cardDivider);
        appendChild(card, imgPlaceholder);
        appendChild(imgPlaceholder);
        appendChild(imgPlaceholder, img);
        appendChild(card, cardSection);
        appendChild(cardSection, divContent);

        // Prepare card content
        // appendChild(divContent, pFname);
        // appendChild(divContent, pLname);
        // appendChild(divContent, pEmail);
        // appendChild(divControls, videoIcon);
        // appendChild(divControls, chatIcon);

        addAttribute(cell, "class", `cell small-12 medium-4`);
        addAttribute(card, "class", "card");
        addAttribute(cardSection, "class", "card-section");
        addAttribute(cardDivider, "class", "card-divider");
        addAttribute(imgPlaceholder, "class", "card-image");
        addAttribute(
          imgPlaceholder,
          "style",
          "text-align:center; margin:5px 0;"
        );
        addAttribute(
          divControls,
          "class",
          "grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2"
        );
        addAttribute(divControls, "style", "margin-bottom: 15px;");
        addAttribute(pFname, "class", "cell");
        addAttribute(pLname, "class", "cell");
        addAttribute(pEmail, "class", "cell");
        addAttribute(pFname, "style", "margin:0;");
        addAttribute(pLname, "style", "margin:0;");
        addAttribute(pEmail, "style", "margin:0;");
        addAttribute(videoIcon, "class", "cell fa-solid fa-camera fa-fw fa-2x");
        addAttribute(videoIcon, "id", `${item.rmtId}`);
        addAttribute(
          chatIcon,
          "class",
          "cell fa-solid fa-comments fa-fw fa-2x"
        );
        addAttribute(chatIcon, "id", `${item.rmtId}`);
        addAttribute(img, "class", "fa-solid fa-user fa-fw fa-5x");
        addAttribute(img, "style", "width:100%;");

        // cardDivider.innerHTML = `${item.fname} ${item.lname}`;
        cardDivider.innerHTML = `${cap(item.fname)}`;
        pEmail.innerHTML = `${item.email}`;
        pFname.innerHTML = `${item.fname}`;
        pLname.innerHTML = `${item.lname}`;

        // if (item.rmtId != rmtId) {
        if (item.hasCamera) {
          appendChild(card, divControls);
          appendChild(divControls, videoIcon);
          appendChild(divControls, chatIcon);

          addClickHandler(videoIcon, (e) => {
            console.log(`\n\tRequesting video chat\n`);
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.VIDEO_CHAT,
            };
            requestChat(data);
          });

          addClickHandler(chatIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.TEXT_CHAT,
            };
            requestChat(data);
          });
          cardDivider.innerHTML = `${item.fname}`;
        } else {
          appendChild(card, divControls);
          appendChild(divControls, chatIcon);

          addClickHandler(chatIcon, (e) => {
            const data = {
              sender: personalCode,
              receiver: e.target.id,
              requestType: chatType.TEXT_CHAT,
            };
            requestChat(data);
          });
          cardDivider.innerHTML = `${item.fname}`;
        }
        // }
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
  const { sender, type } = userDetails;
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
  addAttribute(closeButton, "aria-label", "");
  addAttribute(closeButton, "type", "button");
  addAttribute(closeButton, "data-close", "");
  addAttribute(span, "aria-hidden", "true");
  addAttribute(
    controlsDiv,
    "class",
    "grid-x grid-margin-x align-center small-12 medium-up-6"
  );
  addAttribute(rejectButton, "class", "cell button alert");
  addAttribute(acceptButton, "class", "cell button success");
  // addAttribute(rejectButton, "style", "width:45%; margin-right:5px;");
  // addAttribute(acceptButton, "style", "width:45%;margin-left:5px;");
  addAttribute(message, "style", "font-size:1.5rem;font-weight:bolder;");

  // Inner HTML
  rejectButton.innerHTML = "Reject";
  acceptButton.innerHTML = "Accept";
  span.innerHTML = `&times;`;
  message.innerHTML = `${cap(sender.fname)} ${cap(sender.lname)} wants to ${
    type == "VIDEO_CHAT" ? "video chat" : "text chat"
  } with you`;

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

// Helpers
