import * as elements from "./dashboardelements.js";
import {
  addHandler,
  log,
  getAttribute,
  newElement,
  appendChild,
  addAttribute,
  appendBeforeLastChild,
  addClickHandler,
} from "./utils.js";

window.onload = () => {
  // start();
  log(`\n\tLanded on the dashboard view\n`);
};

/* addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
  const rmtUserId = document.querySelector("#rmtuser").value;
  const data = { rmtUser: rmtUserId };
  socket.emit("disconnectme", data);
}); */

addHandler(elements.showPresenceInput, "click", (e) => {
  const target = e.target;
  elements.showPresence.innerHTML = target.checked ? "Hidden" : "Visible";

  socket.emit("changevisibility", {
    userId: socket.id,
    show: target.checked,
  });
});

addHandler(elements.searchInput, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9\@\-]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactEmail, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9\@]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactFname, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9 ]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactLname, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9 ]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactPhone, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^\-0-9]/gi, "").trim();

  console.log(text);
  element.value = text;
});

if (document.title.toLowerCase().trim() == "dashboard") {
  addHandler(elements.newContactLink, "click", () => {
    prepareNewContactLink();

    elements.newContactForm.classList.toggle("show");
  });

  addClickHandler(elements.searchLink, (e) => {
    log(`\n\tSearch link clicked\n`);
  });
}

addHandler(elements.addEmailButton, "click", () => {
  log(`\n\tAdded email field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const divGroup = newElement("div");
  const spanInputGroupLabel = newElement("span");
  const emailInput = newElement("input");
  const trashIcon = newElement("i");
  const emailIcon = newElement("i");

  // Add attributes
  addAttribute(divGroup, "class", "grid-x");
  addAttribute(divInputGroup, "class", "input-group");
  addAttribute(spanInputGroupLabel, "class", "input-group-label");
  addAttribute(emailInput, "type", "email");
  addAttribute(emailInput, "required", "");
  addAttribute(emailInput, "class", "input-group-field");
  addAttribute(
    emailInput,
    "name",
    `email${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "fa-solid fa-trash");
  addAttribute(emailIcon, "class", "fa-solid fa-envelope");
  addAttribute(trashIcon, "style", "margin-left:5px;margin-top:10px; ");

  // Config elements
  // spanInputGroupLabel.innerHTML = `<i class="fa-solid fa-envelope"></i>`;

  // Append to document
  appendBeforeLastChild(editContactForm, divGroup);
  appendChild(divGroup, divInputGroup);
  appendChild(divInputGroup, spanInputGroupLabel);
  appendChild(divInputGroup, emailInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(spanInputGroupLabel, emailIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

addHandler(elements.addPhoneButton, "click", () => {
  log(`\n\tAdded phone field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const divGroup = newElement("div");
  const spanInputGroupLabel = newElement("span");
  const phoneInput = newElement("input");
  const trashIcon = newElement("i");
  const phoneIcon = newElement("i");

  // Add attributes
  addAttribute(divGroup, "class", "grid-x");
  addAttribute(divInputGroup, "class", "input-group");
  addAttribute(spanInputGroupLabel, "class", "input-group-label");
  addAttribute(phoneInput, "type", "tel");
  addAttribute(phoneInput, "required", "");
  addAttribute(phoneInput, "class", "input-group-field");
  addAttribute(
    phoneInput,
    "name",
    `phone${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "fa-solid fa-trash");
  addAttribute(phoneIcon, "class", "fa-solid fa-phone");
  addAttribute(trashIcon, "style", "margin-left:5px;margin-top:10px; ");

  // Config elements
  // spanInputGroupLabel.innerHTML = `<i class="fa-solid fa-envelope"></i>`;

  // Append to document
  appendBeforeLastChild(editContactForm, divGroup);
  appendChild(divGroup, divInputGroup);
  appendChild(divInputGroup, spanInputGroupLabel);
  appendChild(divInputGroup, phoneInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(spanInputGroupLabel, phoneIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

// Helper functions
function prepareNewContactLink() {
  log(`\n\tNew contact link prepared\n`);
  if (elements.controlPanel.classList.contains("show")) {
    elements.controlPanel.classList.remove("show");
    setTimeout(() => {
      elements.controlPanelLink.innerHTML =
        elements.controlPanel.classList.contains("show")
          ? "Hide Control Panel"
          : "Show Control Panel";
    }, 450);
  }

  /*  if (elements.peersList.classList.contains("show")) {
    elements.peersList.classList.remove("show");
    setTimeout(() => {
      elements.peersLink.innerHTML = elements.peersList.classList.contains(
        "show"
      )
        ? "Hide Peers"
        : "Show Peers";
    }, 450);
  } */
}

// Messages
addHandler(elements.closeButton, "click", (e) => {
  const target = e.target;
  const parent = target.parentElement;
  const grandParent = parent.parentElement;
  grandParent.remove();
});
