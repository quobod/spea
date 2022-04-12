import { addHandler, log } from "./utils.js";
import * as elements from "./elements.js";

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
});

addHandler(elements.closeButton, "click", (e) => {
  const target = e.target;
  const parent = target.parentElement;
  const grandParent = parent.parentElement;
  grandParent.remove();
});
