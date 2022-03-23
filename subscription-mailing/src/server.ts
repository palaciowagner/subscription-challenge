import EmailTopicConsumer from "@/consumers/email.consumer";
import App from "@/app";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new EmailTopicConsumer()]);

app.start();
