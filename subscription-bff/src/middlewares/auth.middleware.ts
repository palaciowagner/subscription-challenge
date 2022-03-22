import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithSubscription } from '@interfaces/auth.interface';
import SubscriptionsService from '@/services/subscriptions.service';
import SubscriptionsController from '@/controllers/subscriptions.controller';

export const authMiddleware = (subscriptionsController: SubscriptionsController): RequestHandler => {
  return async (req: RequestWithSubscription, res: Response, next: NextFunction) => {
    try {
      const authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

      if (!authorization) {
        next(new HttpException(401, 'Authentication token is missing'));
      }

      const secretKey: string = SECRET_KEY;
      const { email } = verify(authorization, secretKey) as DataStoredInToken;

      const foundSubscription = await subscriptionsController.subscriptionService.getSubscription(email);

      if (!foundSubscription) {
        next(new HttpException(401, 'Wrong or expired authentication token'));
      }

      if (foundSubscription.email !== email) {
        next(new HttpException(403, `You're not allowed to perform this operation`));
      }

      req.subscription = foundSubscription;
      next();
    } catch (error) {
      console.log(error);
      next(new HttpException(401, 'Wrong or expired authentication token'));
    }
  };
};
