import { createApp } from "vue";
import "./styles.css";
import Antd from "ant-design-vue";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);

app.use(Antd).mount("#app");
