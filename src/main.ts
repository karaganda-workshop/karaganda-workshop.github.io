import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";
import { initMetaPixel } from "./lib/metaPixel";
import { initYandexMetrika } from "./lib/yandexMetrika";

initMetaPixel();
initYandexMetrika();

createApp(App).mount("#app");
