import SubscriptionsService from '@services/subscriptions.service';
import axios from 'axios';

jest.mock('axios');

describe('Subscription Service', () => {
  describe('Get All Subscriptions', () => {
    it('should hit api client and return all subscriptions', async () => {
      // given
      const mockResponse = [
        {
          email: 'another-test@email.com',
          firstName: 'Maria',
          gender: 'non-binary',
          dateOfBirth: new Date('1993-12-30').toISOString(),
          flagForConsent: true,
          newsletterId: 39439,
        },
      ];

      axios.get = jest.fn().mockReturnValue(mockResponse);

      const subscriptionService = new SubscriptionsService(axios);
      const subscriptions = await subscriptionService.findAllSubscriptions();

      // then
      expect(axios.get).toHaveBeenCalled();
      expect(subscriptions).toEqual(mockResponse);
    });
  });
});
