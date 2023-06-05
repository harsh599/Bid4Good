import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/main.css";
import { plugin, defaultConfig } from "@formkit/vue";
import "@formkit/themes/genesis";
import Notifications from "@kyvg/vue3-notification";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faTrashCan,
  faSignOutAlt,
  faHeart,
  faUserCircle,
  faUser,
  faUserSecret,
  faFilter,
  faGavel,
  faImage,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import store from "./store";

library.add(
  faGavel,
  faHouse,
  faTrashCan,
  faSignOutAlt,
  faHeart,
  faUserCircle,
  faUser,
  faUserSecret,
  faFilter,
  faImage,
  faCheck,
  faXmark,
  faGavel
);

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.use(plugin, defaultConfig);
app.use(vuetify);
app.use(Notifications);
app.use(store);
app.mount("#app");
