import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  KAFKA_CLIENT_GROUP,
  KAFKA_BROKER,
  KAFKA_CONSUMER_GROUP,
  KAFKA_EMAIL_SENDER_TOPIC_NAME,
} = process.env;
