import { CreateSubscriptionRequestDto } from '@/dtos/subscription.dto';
import SubscriptionsService from '@services/subscriptions.service';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios', () => ({
  create: jest.fn().mockImplementation(()=> axios),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}));

describe('Subscription Service', () => {
  const mockAxiosResponseDefault: AxiosResponse = {
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
  
  describe('Get All Subscriptions', () => {
    it('should hit api client and return all subscriptions', async () => {
      axios.get = jest.fn().mockReturnValue(mockAxiosResponseDefault);

      const subscriptionService = new SubscriptionsService(() => axios);
      const subscriptions = await subscriptionService.findAllSubscriptions();

      expect(axios.get).toHaveBeenCalled();
      expect(subscriptions).toEqual(mockAxiosResponseDefault.data.data);
    });
  });

  describe('Create Subscription', () => {
    const defaultRequestDto = new CreateSubscriptionRequestDto();
    it('should create and return subscription ID', async () => {
      axios.post = jest.fn().mockReturnValue({ ...mockAxiosResponseDefault });

      const subscriptionService = new SubscriptionsService(() => axios);

      const created = await subscriptionService.createSubscription(defaultRequestDto);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(created).toEqual(mockAxiosResponseDefault.data.data);
    });

    it('should return null if fails creating', async () => {
      axios.post = jest.fn().mockReturnValue({ ...mockAxiosResponseDefault, status: 409, data: undefined });

      const subscriptionService = new SubscriptionsService(() => axios);

      const created = await subscriptionService.createSubscription(defaultRequestDto);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(created).toEqual(null);
    });
  });

  describe('Get Subscription', () => {
    it('should hit api client and return single subscription', async () => {
      axios.get = jest.fn().mockReturnValue(mockAxiosResponseDefault);

      const subscriptionService = new SubscriptionsService(() => axios);
      const email = 'another-test@email.com';
      const subscriptions = await subscriptionService.getSubscription(email);

      expect(axios.get).toHaveBeenCalled();
      expect(subscriptions).toEqual(mockAxiosResponseDefault.data.data);
    });
  });

  describe('Cancel Subscription', () => {
    it('should call API client but not expect its return', async () => {
      axios.put = jest.fn();

      const subscriptionService = new SubscriptionsService(() => axios);
      const email = 'another-test@email.com';
      await subscriptionService.cancel(email);

      expect(axios.put).toHaveBeenCalled();
    });
  });
});
