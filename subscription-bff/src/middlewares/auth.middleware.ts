import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithSubscription } from '@interfaces/auth.interface';
import SubscriptionsService from '@/services/subscriptions.service';

export const authMiddleware = async (req: RequestWithSubscription, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const { email } = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const foundSubscription = await new SubscriptionsService().getSubscription(email);

      if (foundSubscription) {
        req.subscription = foundSubscription;
        next();
      } else {
        next(new HttpException(401, 'Wrong or expired authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token is missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong or expired authentication token'));
  }
};
