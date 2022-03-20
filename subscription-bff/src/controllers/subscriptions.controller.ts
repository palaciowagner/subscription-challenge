import { HttpException } from '@/exceptions/HttpException';
import { Subscription } from '@/interfaces/subscription.interface';
import SubscriptionsService from '@/services/subscriptions.service';
import { logger } from '@/utils/logger';
import { CreateSubscriptionRequestDto, SubscriptionResponseDto } from '@dtos/subscription.dto';
import { NextFunction, Request, Response } from 'express';

export default class SubscriptionsController {
  public subscriptionService = new SubscriptionsService();

  public getAllSubscriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllSubscriptionsResponse: Subscription[] = await this.subscriptionService.findAllSubscriptions();
      if (findAllSubscriptionsResponse.length < 1) throw new HttpException(204, `No subscriptions found`);

      const subscriptionResponseDto = new SubscriptionResponseDto().mapFrom(findAllSubscriptionsResponse);

      res.status(200).json({ data: subscriptionResponseDto, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public createSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionRequest: CreateSubscriptionRequestDto = req.body;

      const createdSubscription: Subscription = await this.subscriptionService.createSubscription(subscriptionRequest);

      const subscriptionResponseDto = new SubscriptionResponseDto().mapFrom([createdSubscription]);

      res.status(201).json({ data: subscriptionResponseDto, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
