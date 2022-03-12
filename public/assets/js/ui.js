import {
  addAttribute,
  addHandler,
  appendChild,
  removeAttribute,
  newElement,
  log,
  removeChildren,
} from "./utils.js";
import * as elements from "./userelements.js";

const showMessageDialog = (closeButtonHandler) => {
  const dialog = elements.dialog;
  const divContainer = newElement("div");
  const pTitle = newElement("p");
};

export const updateUserList = (data) => {
  if (elements.peersList) {
    const userList = elements.peersList;
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
      }
    });
  }
};

export const updatePersonalCode = (personalCode) => {
  elements.personalCode.value = personalCode;
};
