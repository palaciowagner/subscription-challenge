import { KAFKA_EMAIL_SENDER_TOPIC_NAME } from "@/config";
import { KafkaConsumer } from "@connections/kafka.connection";
import { EmailMessage } from "@interfaces/email.interface";
import { MessageHandler } from "@interfaces/messageHandler.interface";
import EmailService from "@services/email.service";
import { EachMessagePayload } from "kafkajs";

export default class EmailTopicConsumer
  extends KafkaConsumer
  implements MessageHandler
{
  _emailService: EmailService;

  constructor(emailService = new EmailService()) {
    super(KAFKA_EMAIL_SENDER_TOPIC_NAME);
    this._emailService = emailService;
  }

  handle = async (messagePayload: EachMessagePayload): Promise<void> => {
    const { message } = messagePayload;

    await this._emailService.send({
      ...message,
      content: message.value,
    });

    super.handle(messagePayload);
  };
}
