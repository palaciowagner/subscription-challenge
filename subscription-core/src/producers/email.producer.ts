import { kafka } from '@/connections/kafka.connection';
import bcrypt from 'bcrypt';

const TOPIC = 'email-sender';

export class EmailProducer {
  private producer = kafka.producer();

  public send = async (message: SubscriptionEmailMessage) => {
    await this.producer.connect();

    const stringfiedMessage = JSON.stringify(message);
    const key = await this.createKey(stringfiedMessage);

    await this.producer.send({
      topic: TOPIC,
      messages: [{ key, value: stringfiedMessage }],
    });

    await this.producer.disconnect();
  };

  private createKey = async (message: string): Promise<string> => {
    return await bcrypt.hash(message, 1);
  };
}

export interface SubscriptionEmailMessage {
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
