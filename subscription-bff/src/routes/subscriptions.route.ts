import SubscriptionsController from '@/controllers/subscriptions.controller';
import { CreateSubscriptionRequestDto } from '@/dtos/subscription.dto';
import { Routes } from '@/interfaces/routes.interface';
import { authMiddleware } from '@/middlewares/auth.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import redisClient from '@clients/redis.client';

export default class SubscriptionsRoute implements Routes {
  public path = '/subscriptions';
  public router = Router();
  public subscriptionsController = new SubscriptionsController();
  private cache = redisClient;

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(CreateSubscriptionRequestDto, 'body'), this.subscriptionsController.createSubscription);
    this.router.get(`${this.path}`, this.cache.route(), this.subscriptionsController.getAllSubscriptions);
    this.router.get(`${this.path}/:email`, this.cache.route(), this.subscriptionsController.getSubscriptionByEmail);
    this.router.put(
      `${this.path}/:email/cancel`,
      authMiddleware(this.subscriptionsController),
      this.subscriptionsController.cancelSubscriptionByEmail,
    );
  }
}
