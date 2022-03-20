import { Subscription } from '@/interfaces/subscription.interface';
import { IsBoolean, IsDateString, IsEmail, IsNumber, IsOptional, IsString, IS_ISO8601 } from 'class-validator';

interface SubscriptionDto {
  id: string;
  email: string;
  firstName: string | undefined;
  gender: string | undefined;
  dateOfBirth: string;
  flagForConsent: boolean;
  newsletterId: number;
}

export class SubscriptionResponseDto {
  subscriptions: SubscriptionDto[];

  public mapFrom(subscriptions: Subscription[]) {
    this.subscriptions = subscriptions.map((subscription): SubscriptionDto => {
      return {
        id: subscription.id,
        email: subscription.email,
        firstName: subscription.firstName,
        gender: subscription.gender,
        dateOfBirth: subscription.dateOfBirth.toString(),
        flagForConsent: subscription.flagForConsent,
        newsletterId: subscription.newsletterId,
      };
    });
    return this.subscriptions;
  }
}

export class CreateSubscriptionRequestDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsOptional()
  public firstName: string;

  @IsString()
  @IsOptional()
  public gender: string;

  @IsDateString()
  public dateOfBirth: string;

  @IsBoolean()
  public flagForConsent: boolean;

  @IsNumber()
  public newsletterId: number;
}
