import SubscriptionsController from '@/controllers/subscriptions.controller';
import { Routes } from '@/interfaces/routes.interface';
import { Router } from 'express';

export default class SubscriptionsRoute implements Routes {
  public path = '/subscriptions';
  public router = Router();
  public subscriptionsController = new SubscriptionsController();

  constructor() {
    this.initializeRoutes();
  }
  // TODO - add authMiddleware
  private initializeRoutes() {
    //   this.router.post(`${this.path}`, validationMiddleware(CreateSubscriptionDto, 'body'), this.subscriptionsController.createSubscription);
    this.router.get(`${this.path}`, this.subscriptionsController.getAllSubscriptions);
    //   this.router.get(`${this.path}/:email`, this.subscriptionsController.getSubscriptionByEmail);
    //   this.router.put(`${this.path}/:email/cancel`, this.subscriptionsController.cancelSubscription);
  }
}