import { EachMessagePayload } from "kafkajs";

export interface MessageHandler {
  handle: (messagePayload: EachMessagePayload) => void;
}
