import { KAFKA_EMAIL_SENDER_TOPIC_NAME } from "@/config";
import { KafkaConsumer } from "@/connections/kafka.connection";
import { MessageHandler } from "@/interfaces/messageHandler.interface";

export default class EmailConsumer extends KafkaConsumer implements MessageHandler {
  constructor() {
    super(KAFKA_EMAIL_SENDER_TOPIC_NAME);
  }
}
