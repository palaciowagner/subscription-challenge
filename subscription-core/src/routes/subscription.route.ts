import SubscriptionsController from "@/controllers/subscriptions.controller";
import { CreateSubscriptionDto } from "@/dtos/subscriptions.dto";
import { Routes } from "@/interfaces/routes.interface";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Router } from "express";

class SubscriptionsRoute implements Routes {
    public path = '/subscriptions';
    public router = Router();
    public subscriptionsController = new SubscriptionsController();
  
    constructor() {
      this.initializeRoutes();
    }
    // TODO - add authMiddleware
    private initializeRoutes() {
      this.router.post(`${this.path}`, validationMiddleware(CreateSubscriptionDto, 'body'), this.subscriptionsController.createSubscription);
      this.router.get(`${this.path}`, this.subscriptionsController.getSubscriptions);
      this.router.get(`${this.path}/:email`, this.subscriptionsController.getSubscriptionByEmail);
      this.router.put(`${this.path}/:email/cancel`, this.subscriptionsController.cancelSubscription);
    }
  }
  
  export default SubscriptionsRoute;
  