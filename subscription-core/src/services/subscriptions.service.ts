import { CreateSubscriptionDto } from '@/dtos/subscriptions.dto';
import { SubscriptionEntity } from '@/entities/subscription.entity';
import { HttpException } from '@/exceptions/HttpException';
import { Subscription } from '@/interfaces/subscription.interface';
import { isEmpty } from 'class-validator';
import { EntityRepository, Repository } from 'typeorm';
import { EmailMessage, EmailProducer } from '@/producers/email.producer';

@EntityRepository()
class SubscriptionService extends Repository<SubscriptionEntity> {
  emailProducer = new EmailProducer();

  public async createSubscription(subscriptionRequest: CreateSubscriptionDto): Promise<Subscription> {
    if (isEmpty(subscriptionRequest)) throw new HttpException(400, 'This is not a valid subscription request');
    let createSubscriptionData: Subscription;

    const findSubscription: Subscription = await SubscriptionEntity.findOne({ where: { email: subscriptionRequest.email } });

    if (!findSubscription){
      createSubscriptionData = await SubscriptionEntity.create({ ...subscriptionRequest }).save();
    }
    else{
      if (findSubscription.isActive) throw new HttpException(409, `A subscription for ${subscriptionRequest.email} already exists`);
  
      await SubscriptionEntity.update({ email: subscriptionRequest.email }, { ...subscriptionRequest, isActive: true });
      createSubscriptionData =  await SubscriptionEntity.findOne({ where: { email: subscriptionRequest.email } });
    }

    await this.emailProducer.send(createSubscriptionData as EmailMessage);
    return createSubscriptionData;
  }

  public async findSubscriptionByEmail(email: string): Promise<Subscription> {
    if (isEmpty(email)) throw new HttpException(400, 'An e-mail should be provided');

    const findSubscription: Subscription = await SubscriptionEntity.findOne({ where: { email: email } });
    if (!findSubscription) throw new HttpException(404, `Subscription for ${email} was not found`);

    return findSubscription;
  }

  public async findAllSubscriptions(): Promise<Subscription[]> {
    const foundSubscriptions: Subscription[] = await SubscriptionEntity.find();
    if (foundSubscriptions.length < 1) throw new HttpException(204, `No subscriptions found`);

    return foundSubscriptions;
  }

  public async cancelSubscription(subscriptionEmail: string): Promise<Subscription> {
    if (isEmpty(subscriptionEmail)) throw new HttpException(400, 'An e-mail should be provided');

    const findSubscription: Subscription = await SubscriptionEntity.findOne({ where: { email: subscriptionEmail } });
    if (!findSubscription) throw new HttpException(404, `Subscription for ${subscriptionEmail} was not found`);

    await SubscriptionEntity.update({ email: subscriptionEmail }, { isActive: false });
    return await SubscriptionEntity.findOne({ where: { email: subscriptionEmail } });
  }
}

export default SubscriptionService;
