import { IsBoolean, IsDate, IsDateString, IsEmail, IsISO8601, IsNumber, IsOptional, IsString, IS_ISO8601 } from 'class-validator';

export class CreateSubscriptionDto {
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
