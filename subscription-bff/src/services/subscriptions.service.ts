import { CreateSubscriptionRequestDto } from '@/dtos/subscription.dto';
import { Subscription } from '@/interfaces/subscription.interface';
import { CoreApiClient } from '@clients/core.client';
import { AxiosResponse } from 'axios';

export default class SubscriptionsService {
  constructor(private readonly client: typeof CoreApiClient = CoreApiClient) {}

  public async findAllSubscriptions(): Promise<Subscription[]> {
    const foundSubscriptions = await this.client.get('/subscriptions');
    if (!foundSubscriptions.data) return [];
    return foundSubscriptions.data.data;
  }

  public async createSubscription(createSubscriptionRequestDto: CreateSubscriptionRequestDto): Promise<Subscription> {
    const created = await this.client.post('/subscriptions', createSubscriptionRequestDto);
    if (!created.data || created.data === undefined || created.data === {}) return null;

    return created.data.data;
  }

  public async getSubscription(email: string): Promise<Subscription> {
    const found = await this.client.get(`/subscriptions/${email}`);
    if (!found.data) return null;

    return found.data.data;
  }
  
  public async cancel(email: string): Promise<void> {
    await this.client.put(`/subscriptions/${email}/cancel`);
  }
}
