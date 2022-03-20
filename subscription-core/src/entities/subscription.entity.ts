import { Subscription } from '@/interfaces/subscription.interface';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity({name:'subscription'})
export class SubscriptionEntity extends BaseEntity implements Subscription {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column({nullable: true})
  @IsOptional()
  firstName: string | undefined;

  @Column({nullable: true})
  @IsOptional()
  gender: string | undefined;

  @Column()
  @IsNotEmpty()
  dateOfBirth: Date;

  @Column()
  @IsNotEmpty()
  newsletterId: number;

  @Column()
  @IsNotEmpty()
  flagForConsent: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({default: true})
  @IsNotEmpty()
  isActive: boolean = true;
}