import { Subscription } from '@/interfaces/subscription.interface';
import SubscriptionsService from '@services/subscriptions.service';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

describe('Subscription Service', () => {
  describe('Get All Subscriptions', () => {
    it('should hit api client and return all subscriptions', async () => {
      // given
      const mockResponse: AxiosResponse = {
        status: 200,
        statusText: '',
        headers: undefined,
        config: undefined,
        data: {
          data: [
            {
              id: '1',
              email: 'another-test@email.com',
              firstName: 'Maria',
              gender: 'non-binary',
              dateOfBirth: new Date('1993-12-30'),
              flagForConsent: true,
              newsletterId: 39439,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
            },
          ],
          message: 'found',
        },
      };

      axios.get = jest.fn().mockReturnValue(mockResponse);

      const subscriptionService = new SubscriptionsService(axios);
      const subscriptions = await subscriptionService.findAllSubscriptions();

      // then
      expect(axios.get).toHaveBeenCalled();
      expect(subscriptions).toEqual(mockResponse.data.data);
    });
  });
});
