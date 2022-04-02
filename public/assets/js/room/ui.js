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
        const divPanel = newElement("div");
        const button = newElement("button");
        const divDetails = newElement("div");
        const divControls = newElement("div");
        const pFname = newElement("p");
        const pLname = newElement("p");
        const pEmail = newElement("p");
        const videoIcon = newElement("i");
        const chatIcon = newElement("i");

        appendChild(userList, button);
        appendChild(userList, divPanel);
        appendChild(divPanel, divDetails);
        appendChild(divControls, videoIcon);
        appendChild(divControls, chatIcon);
        appendChild(divDetails, pFname);
        appendChild(divDetails, pLname);
        appendChild(divDetails, pEmail);
        appendChild(divControls, videoIcon);
        appendChild(divControls, chatIcon);

        addAttribute(divPanel, "class", "grid-x panel");
        addAttribute(divPanel, "style", "z-index: 101;");
        addAttribute(divControls, "class", "cell small-12");
        addAttribute(divControls, "id", "peer-list-controls");
        addAttribute(divControls, "style", "z-index:102;");
        addAttribute(divDetails, "class", "cell small-12 grid-x");
        addAttribute(
          divDetails,
          "style",
          "margin-left: 5px; margin-right: 5px;"
        );
        addAttribute(pFname, "class", "cell small-12 text-center");
        addAttribute(pLname, "class", "cell small-12 text-center");
        addAttribute(pEmail, "class", "cell small-12 text-center");
        addAttribute(pFname, "style", "margin:0;");
        addAttribute(pLname, "style", "margin:0;");
        addAttribute(pEmail, "style", "margin:0;");
        addAttribute(button, "class", "button");
        addAttribute(videoIcon, "class", "fa-solid fa-camera fa-fw fa-2x");
        addAttribute(chatIcon, "class", "fa-solid fa-comments fa-fw fa-2x");
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

        if (item.uid != personalCode) {
          appendChild(divPanel, divControls);
        }
      }
    });
  }
};
