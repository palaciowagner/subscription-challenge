import { NextFunction, Request, Response } from 'express';
import { CreateSubscriptionDto } from '@/dtos/subscriptions.dto';
import { Subscription } from '@/interfaces/subscription.interface';
import SubscriptionService from '@/services/subscriptions.service';

class SubscriptionsController {
  public subscriptionService = new SubscriptionService();

  public createSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionRequest: CreateSubscriptionDto = req.body;
      const createSubscriptionResponse: Subscription = await this.subscriptionService.createSubscription(subscriptionRequest);

      res.status(201).json({ data: createSubscriptionResponse, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getSubscriptionByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionEmail = String(req.params.email);
      const findSubscriptionResponse: Subscription = await this.subscriptionService.findSubscriptionByEmail(subscriptionEmail);

      res.status(200).json({ data: findSubscriptionResponse, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public getSubscriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllSubscriptionsResponse: Subscription[] = await this.subscriptionService.findAllSubscriptions();

      res.status(200).json({ data: findAllSubscriptionsResponse, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public cancelSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionEmail = String(req.params.email);
      const canceledSubscription: Subscription = await this.subscriptionService.cancelSubscription(subscriptionEmail);

      res.status(200).json({ data: canceledSubscription, message: 'canceled successfuly' });
    } catch (error) {
      next(error);
    }
  }
}

export default SubscriptionsController;
