import { EmailMessage } from "@/interfaces/email.interface";
import { Subscription } from "@/model/subscription.model";
import { logger } from "@/utils/logger";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";

const emailTemplate = (subscription: Subscription) =>
  `Welcome ${subscription.firstName}! 
  \nYou're officially subscribed to Adidas newsletter under e-mail ${subscription.email}`;

export default class EmailService {
  send = async (emailMessage: EmailMessage) => {
    const subscription = plainToInstance(Subscription, emailMessage.content);
    validate(subscription).then((errors: ValidationError[]) => {
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
