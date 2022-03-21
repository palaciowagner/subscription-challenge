import { KafkaConsumer } from "@/connections/kafka.connection";
import { NODE_ENV, PORT } from "@/config";
import { logger } from "@/utils/logger";

export default class App {
  public env: string;
  public port: string | number;
  public consumers: KafkaConsumer[];

  constructor(consumers: KafkaConsumer[]) {
    this.env = NODE_ENV || "development";
    this.port = PORT || 7000;
    this.consumers = consumers;

    this.start();
  }

  public start() {
    logger.info(`=================================`);
    logger.info(`=======Subscription Mailing======`);
    logger.info(`======= ENV: ${this.env} =======`);
    logger.info(`🚀 App listening on port ${this.port}`);
    logger.info(`=================================`);

    this.consumers.forEach((consumer) => {
      consumer.listen();
    });
  }
}
