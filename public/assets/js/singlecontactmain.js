import * as elements from "./singlecontactelements.js";
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
