import { KafkaMessage } from "kafkajs";

export interface EmailMessage extends KafkaMessage {
  content: Buffer | null;
}
