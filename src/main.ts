import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";
import { initMetaPixel } from "./lib/metaPixel";
import { initYandexMetrika } from "./lib/yandexMetrika";
import { initGoogleTag } from "./lib/googleTag";

initMetaPixel();
initYandexMetrika();
initGoogleTag();

createApp(App).mount("#app");
