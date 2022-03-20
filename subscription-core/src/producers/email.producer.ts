import { kafka } from '@/connections/kafka.connection';
import { Message } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const TOPIC = 'email-sender';

export class EmailProducer {
  private producer = kafka.producer();

  public send = async (message: EmailMessage) => {
    await this.producer.connect();
    await this.producer.send({
      topic: TOPIC,
      messages: [{ key: uuidv4(), value: JSON.stringify(message) }],
    });

    await this.producer.disconnect();
  };
}

export interface EmailMessage {
  id: string;
  email: string;
  firstName: string | undefined;
  gender: string | undefined;
  dateOfBirth: Date;
  flagForConsent: boolean;
  newsletterId: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
