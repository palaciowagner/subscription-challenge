import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class Subscription {
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
