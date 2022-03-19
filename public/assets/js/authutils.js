import { addHandler } from "./utils.js";

// Signin
export const signinEmailInput = document.querySelector("#signin-email");
export const signinPwdInput = document.querySelector("#signin-pwd");
export const sigSubmitButton = document.querySelector("#sig-submit-button");

// Register
export const regFnameInput = document.querySelector("#fname");
export const regLnameInput = document.querySelector("#lname");
export const regEmail = document.querySelector("#reg-email");
export const regPwd = document.querySelector("#reg-pwd");
export const regPwd2 = document.querySelector("#reg-pwd2");
export const regPwd2Error = document.querySelector("#reg-pwd2-error");
export const regSubmitButton = document.querySelector("#reg-submit-button");

// Message dialog
export const dialogCloseButton = document.querySelector(".close-button");

// Signin
if (document.title.toLowerCase().trim() === "signin") {
  console.log("signin");
  const sigEmail = signinEmailInput;
  const sigPwd = signinPwdInput;

  addHandler(sigEmail, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value.replace(/[^a-zA-Z\.0-9\@]/gi, "").trim();
    console.log(text);
    element.value = text;
  });

  addHandler(sigPwd, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value
      .replace(/[^a-zA-Z\.0-9\!@\#\$\%\^\&\*\_\-\=\+\?]/gi, "")
      .trim();

    console.log(text);
    element.value = text;
  });
}

// Register
if (document.title.toLowerCase().trim() === "register") {
  addHandler(fname, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value.replace(/[^a-zA-Z\.0-9]/gi, "").trim();

    console.log(text);
    element.value = text;
    validate();
  });

  addHandler(lname, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value.replace(/[^a-zA-Z\.0-9]/gi, "").trim();

    console.log(text);
    element.value = text;
    validate();
  });

  addHandler(regEmail, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value.replace(/[^a-zA-Z\.0-9\@\.]/gi, "").trim();

    console.log(text);
    element.value = text;
    validate();
  });

  addHandler(regPwd, "keyup", (e) => {
    const element = e.target;
    const value = e.target.value;
    const text = value
      .replace(/[^a-zA-Z\.0-9\!@\#\$\%\^\&\*\_\-\=\+\?]/gi, "")
      .trim();

    console.log(text);
    element.value = text;
    validate();
  });

  addHandler(regPwd2, "keyup", (e) => {
    const element = e.target;
    const pwd2Value = e.target.value;
    const pwd1Value = regPwd.value;
    const pwd2Text = pwd2Value
      .replace(/[^a-zA-Z\.0-9\!@\#\$\%\^\&\*\_\-\=\+\?]/gi, "")
      .trim();
    const pwd1Text = pwd1Value
      .replace(/[^a-zA-Z\.0-9\!@\#\$\%\^\&\*\_\-\=\+\?]/gi, "")
      .trim();

    console.log(pwd2Text);
    element.value = pwd2Text;

    if (pwd2Text !== pwd1Text) {
      regPwd2Error.classList.remove("hide");
      regSubmitButton.disabled = true;
    } else {
      regPwd2Error.classList.add("hide");
      regSubmitButton.disabled = false;
    }
  });
}

// Messages
addHandler(dialogCloseButton, "click", (e) => {
  const target = e.target;
  const parent = target.parentElement;
  const grandParent = parent.parentElement;
  grandParent.remove();
});

// Helper functions

function validate() {
  if (document.title.toLowerCase().trim() == "register") {
    if (
      !fname.value ||
      !lname.value ||
      !regEmail.value ||
      !regPwd.value ||
      !regPwd2.value
    ) {
      regSubmitButton.disabled = true;
    } else {
      regSubmitButton.disabled = false;
    }
  }

  if (document.title.toLowerCase().trim() == "signin") {
    if (!signinEmail.value || !signinPassword.value) {
      sigSubmitButton.disabled = true;
    } else {
      sigSubmitButton.disabled = false;
    }
  }
}
