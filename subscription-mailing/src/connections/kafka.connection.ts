import {
  KAFKA_BROKER,
  KAFKA_CLIENT_GROUP,
  KAFKA_CONSUMER_GROUP,
} from "@/config";
import { MessageHandler } from "@/interfaces/messageHandler.interface";
import { logger } from "@/utils/logger";
import {
  Consumer,
  ConsumerSubscribeTopic,
  EachMessagePayload,
  Kafka,
} from "kafkajs";

export class KafkaConsumer implements MessageHandler {
  private kafkaConsumer: Consumer;
  private topicName: string;

  constructor(topicName: string) {
    this.kafkaConsumer = this.create();
    this.topicName = topicName;
  }

  public async handle(messagePayload: EachMessagePayload) {
    const { topic, partition, message } = messagePayload;
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
    logger.info(`- ${prefix} ${message.key}#${message.value}`);
  }

  public create(): Consumer {
    const kafka = new Kafka({
      clientId: KAFKA_CLIENT_GROUP,
      brokers: [KAFKA_BROKER],
    });
    const consumer = kafka.consumer({ groupId: KAFKA_CONSUMER_GROUP });
    return consumer;
  }

  public async listen(): Promise<void> {
    const topic: ConsumerSubscribeTopic = {
      topic: this.topicName,
      fromBeginning: true,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: this.handle,
      });
    } catch (error) {
      logger.error("Error: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }
}
