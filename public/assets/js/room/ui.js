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

        if (item.uid != personalCode) {
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
