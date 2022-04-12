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

/* 
addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
  const rmtUserId = document.querySelector("#rmtuser").value;
  const data = { rmtUser: rmtUserId };
  socket.emit("disconnectme", data);
});

 addHandler(elements.closeButton, "click", (e) => {
    const target = e.target;
    const parent = target.parentElement;
    const grandParent = parent.parentElement;
    grandParent.remove();
    });
*/
addHandler(elements.closeButton, "click", (e) => {
  const target = e.target;
  const parent = target.parentElement;
  const grandParent = parent.parentElement;
  grandParent.remove();
});
