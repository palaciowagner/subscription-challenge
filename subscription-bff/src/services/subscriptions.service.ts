import { CreateSubscriptionRequestDto } from '@/dtos/subscription.dto';
import { Subscription } from '@/interfaces/subscription.interface';
import CoreApiClient from '@clients/core.client';
import { AxiosInstance } from 'axios';

export default class SubscriptionsService {
  _client: AxiosInstance;

  constructor(private readonly client: typeof CoreApiClient = CoreApiClient) {
    this._client = CoreApiClient();
  }

  public async findAllSubscriptions(): Promise<Subscription[]> {
    const foundSubscriptions = await this._client.get('/subscriptions');
    if (!foundSubscriptions.data) return [];
    return foundSubscriptions.data.data;
  }

  public async createSubscription(createSubscriptionRequestDto: CreateSubscriptionRequestDto): Promise<Subscription> {
    const created = await this._client.post('/subscriptions', createSubscriptionRequestDto);
    if (!created.data || created.data === undefined || created.data === {}) return null;

    return created.data.data;
  }

  public async getSubscription(email: string): Promise<Subscription> {
    const found = await this._client.get(`/subscriptions/${email}`);
    if (!found.data) return null;

    return found.data.data;
  }

  public async cancel(email: string): Promise<void> {
    await this._client.put(`/subscriptions/${email}/cancel`);
  }
}
