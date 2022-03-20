import { Subscription } from '@/interfaces/subscription.interface';
import { CoreApiClient } from '@clients/core.client';

export default class SubscriptionsService {
  constructor(private readonly client: typeof CoreApiClient = CoreApiClient) {}

  public async findAllSubscriptions(): Promise<Subscription[]> {
    const foundSubscriptions: Subscription[] = await this.client.get('/subscriptions');
    return foundSubscriptions;
  }
}
