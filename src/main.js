import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueAxios from "vue-axios";
import axios from "axios";

const _axios = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

const app = createApp(App);
app.use(router);

app.use(VueAxios, _axios);
app.mount("#app");
