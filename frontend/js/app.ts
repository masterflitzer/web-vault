import { createApp } from "vue";
import Root from "./Root.js";
import autoColorScheme from "./colorScheme.js";

const title = "Password Manager";
document.title = title;
document.querySelectorAll(".title").forEach((x) => (x.textContent = title));

autoColorScheme();

createApp(Root).mount("#app");
