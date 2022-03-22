import { SECRET_KEY } from '@/config';
import { HttpException } from '@/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import { Subscription } from '@/interfaces/subscription.interface';
import SubscriptionsService from '@/services/subscriptions.service';
import { CreateSubscriptionRequestDto, SubscriptionResponseDto } from '@dtos/subscription.dto';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

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

      const token = this.createToken(createdSubscription);
      this.refreshCookie(res, token);

      res.status(201).json({ data: subscriptionResponseDto, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getSubscriptionByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionEmail = String(req.params.email);
      const foundSubscription: Subscription = await this.subscriptionService.getSubscription(subscriptionEmail);

      const subscriptionResponseDto = new SubscriptionResponseDto().mapFrom([foundSubscription]);

      const token = this.createToken(foundSubscription);
      this.refreshCookie(res, token);

      res.status(200).json({ data: subscriptionResponseDto, message: 'found' });
    } catch (error) {
      next(error);
    }
  };

  public cancelSubscriptionByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscriptionEmail = String(req.params.email);
      this.subscriptionService.cancel(subscriptionEmail);

      res.status(201).json({ message: `Subscription cancel request for ${subscriptionEmail} was accepted` });
    } catch (error) {
      next(error);
    }
  };

  private refreshCookie(res: Response<any, Record<string, any>>, token: TokenData) {
    const cookie = this.createCookie(token);

    if (res.cookie['Authorization']) {
      res.clearCookie['Authorization'];
    }
    res.setHeader('Set-Cookie', [cookie]);
  }

  private createToken(subscription: Subscription): TokenData {
    const dataStoredInToken: DataStoredInToken = { email: subscription.email };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
