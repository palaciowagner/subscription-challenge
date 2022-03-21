import { Request } from 'express';
import { Subscription } from '@interfaces/subscription.interface';

export interface DataStoredInToken {
  email: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithSubscription extends Request {
  subscription: Subscription;
}
