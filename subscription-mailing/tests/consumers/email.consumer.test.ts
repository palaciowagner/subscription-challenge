import { Subscription } from "@/model/subscription.model";
import EmailTopicConsumer from "@consumers/email.consumer";
import { EachMessagePayload, KafkaMessage } from "kafkajs";
import EmailService from "@services/email.service";

jest.mock("@services/email.service");
jest.mock("kafkajs");

const mockedEmailService = new EmailService();

describe("Email Consumer", () => {
  const emailConsumer = new EmailTopicConsumer(mockedEmailService);
  const subscription: Subscription = {
    email: "another-test@email.com",
    firstName: "Maria",
    gender: "non-binary",
    dateOfBirth: new Date("1993-12-30").toISOString(),
    flagForConsent: true,
    newsletterId: 39439,
  };

  const kafkaMessage: KafkaMessage = {
    key: undefined,
    value: Buffer.from(JSON.stringify(subscription)),
    timestamp: "",
    size: 0,
    attributes: 0,
    offset: "",
  };

  const message: EachMessagePayload = {
    topic: "a-topic",
    message: kafkaMessage,
    partition: 0,
    heartbeat: function (): Promise<void> {
      throw new Error("Function not implemented.");
    },
  };
  beforeEach(() => {
    mockedEmailService.send = jest.fn();
  });

  it("should send e-mail", async () => {
    await emailConsumer.handle(message);
    expect(mockedEmailService.send).toHaveBeenCalled();
  });
});
