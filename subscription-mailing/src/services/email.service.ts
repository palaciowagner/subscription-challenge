import { EmailMessage } from "@/interfaces/email.interface";
import { Subscription } from "@/model/subscription.model";
import { logger } from "@/utils/logger";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { email } from "envalid";

const emailTemplate = (subscription: Subscription) =>
  `Welcome ${subscription.firstName ? subscription.firstName : ""}! 
  \nYou're now subscribed to Adidas newsletter under the ${
    subscription.email
  } e-mail address.
  \nEnjoy our content!`;

export default class EmailService {
  send = async (emailMessage: EmailMessage) => {
    const contentStr = emailMessage.content;
    logger.info(`${contentStr}`);

    const subscription = plainToInstance(
      Subscription,
      `${emailMessage.content}`
    );
    validate(subscription, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(", ");
        logger.error(message);
        return;
      }
      logger.info(emailTemplate(subscription));
    });
  };
}
