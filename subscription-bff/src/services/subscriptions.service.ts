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
}
