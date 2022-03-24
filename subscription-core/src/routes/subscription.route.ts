import SubscriptionsController from '@/controllers/subscriptions.controller';
import { CreateSubscriptionDto } from '@/dtos/subscriptions.dto';
import { Routes } from '@/interfaces/routes.interface';
import apiKeyMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';

class SubscriptionsRoute implements Routes {
  public path = '/subscriptions';
  public router = Router();
  public subscriptionsController = new SubscriptionsController();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      apiKeyMiddleware,
      validationMiddleware(CreateSubscriptionDto, 'body'),
      this.subscriptionsController.createSubscription,
    );
    this.router.get(`${this.path}`, apiKeyMiddleware, this.subscriptionsController.getSubscriptions);
    this.router.get(`${this.path}/:email`, apiKeyMiddleware, this.subscriptionsController.getSubscriptionByEmail);
    this.router.put(`${this.path}/:email/cancel`, apiKeyMiddleware, this.subscriptionsController.cancelSubscription);
  }
}

export default SubscriptionsRoute;
