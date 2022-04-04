import * as constants from "../constants.js";
import * as elements from "./roomelements.js";
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

// Exported functions

export const updatePersonalCode = (id) => {
  elements.personalCode.value = id;
};

export const updateUserList = (data) => {
  if (elements.peersList) {
    const userList = elements.peersList;
    const personalCode = elements.personalCode.value;
    removeChildren(userList);

    data.forEach((item, index) => {
      if (!item.hide) {
        const grid = newElement("div");
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
        appendChild(userList, grid);
        appendChild(grid, cell);
        appendChild(cell, card);
        appendChild(card, cardDivider);
        appendChild(card, imgPlaceholder);
        appendChild(imgPlaceholder);
        appendChild(imgPlaceholder, img);
        appendChild(card, cardSection);
        appendChild(cardSection, divContent);

        // Prepare card content
        appendChild(divContent, pFname);
        appendChild(divContent, pLname);
        appendChild(divContent, pEmail);
        appendChild(divControls, videoIcon);
        appendChild(divControls, chatIcon);

        addAttribute(
          grid,
          "class",
          "grid-x grid-margin-x small-up-2 medium-up-3 align-center"
        );
        addAttribute(cell, "class", "cell");
        addAttribute(card, "class", "card");
        addAttribute(cardSection, "class", "card-section");
        addAttribute(cardDivider, "class", "card-divider");
        addAttribute(imgPlaceholder, "class", "card-image");
        addAttribute(imgPlaceholder, "style", "text-align:center;");
        addAttribute(
          divControls,
          "class",
          "grid-x grid-margin-x small-up-1 medium-up-2"
        );
        addAttribute(divControls, "style", "margin-bottom: 15px;");
        addAttribute(pFname, "class", "cell");
        addAttribute(pLname, "class", "cell");
        addAttribute(pEmail, "class", "cell");
        addAttribute(pFname, "style", "margin:0;");
        addAttribute(pLname, "style", "margin:0;");
        addAttribute(pEmail, "style", "margin:0;");
        addAttribute(videoIcon, "class", "cell fa-solid fa-camera fa-fw fa-2x");
        addAttribute(videoIcon, "id", `${item.uid}`);
        addAttribute(
          chatIcon,
          "class",
          "cell fa-solid fa-comments fa-fw fa-2x"
        );
        addAttribute(chatIcon, "id", `${item.uid}`);
        addAttribute(img, "class", "fa-solid fa-user fa-fw fa-5x");
        addAttribute(img, "style", "width:100%;");
        // addAttribute(divContent, "class", "cell small-12");

        cardDivider.innerHTML = `${item.fname} ${item.lname}`;
        pEmail.innerHTML = `${item.email}`;
        pFname.innerHTML = `${item.fname}`;
        pLname.innerHTML = `${item.lname}`;

        /*   addHandler(cardHeader, "click", () => {
          const panel = cardHeader.nextElementSibling;
          cardHeader.classList.toggle("active");
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        }); */

        if (item.uid != personalCode && item.hasCamera) {
          appendChild(card, divControls);
        }
      }
    });
  }
};
