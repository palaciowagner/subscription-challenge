import App from '@/app';
import { CreateSubscriptionRequestDto } from '@/dtos/subscription.dto';
import SubscriptionsRoute from '@/routes/subscriptions.route';
import SubscriptionsService from '@services/subscriptions.service';
import request from '../../hooks/supertest.hook';

jest.mock('@services/subscriptions.service');

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Subscriptions Route', () => {
  describe('[GET] /subscriptions', () => {
    it('should return status 200 OK and return all subscriptions', async () => {
      const subscriptionsRoute = new SubscriptionsRoute();
      subscriptionsRoute.subscriptionsController.subscriptionService = new SubscriptionsService();
      const mockedSubscriptionService = subscriptionsRoute.subscriptionsController.subscriptionService;

      const mockedResponse = [
        {
          id: 1,
          email: 'test@email.com',
          firstName: 'Wagner',
          gender: 'Other',
          dateOfBirth: new Date('1994-04-06').toISOString(),
          flagForConsent: true,
          newsletterId: 345,
        },
        {
          id: 2,
          email: 'another-test@email.com',
          firstName: 'Jose',
          gender: 'Male',
          dateOfBirth: new Date('1980-05-01').toISOString(),
          flagForConsent: true,
          newsletterId: 395304,
        },
        {
          id: 3,
          email: 'a-third-test@email.com',
          firstName: 'Giulia',
          gender: 'Female',
          dateOfBirth: new Date('1998-02-03').toISOString(),
          flagForConsent: true,
          newsletterId: 345,
        },
      ];

      mockedSubscriptionService.findAllSubscriptions = jest.fn().mockResolvedValue(mockedResponse);

      const app = new App([subscriptionsRoute]);
      const content = await request(app.getServer()).get(`${subscriptionsRoute.path}`).expect(200);
      expect(content.text).toContain(JSON.stringify(mockedResponse));
    });

    it('should return 204 NO CONTENT and empty data when API does not return subscriptions', async () => {
      const subscriptionsRoute = new SubscriptionsRoute();
      subscriptionsRoute.subscriptionsController.subscriptionService = new SubscriptionsService();
      const mockedSubscriptionService = subscriptionsRoute.subscriptionsController.subscriptionService;

      mockedSubscriptionService.findAllSubscriptions = jest.fn().mockResolvedValue([]);

      const app = new App([subscriptionsRoute]);
      const content = await request(app.getServer()).get(`${subscriptionsRoute.path}`).expect(204);
      expect(content.text).toEqual('');
    });
  });

  describe('[POST] /subscriptions', () => {
    it('should return 201 ACCEPTED and return subscription', async () => {
      const subscriptionsRoute = new SubscriptionsRoute();
      subscriptionsRoute.subscriptionsController.subscriptionService = new SubscriptionsService();
      const mockedSubscriptionService = subscriptionsRoute.subscriptionsController.subscriptionService;

      const subscriptionRequest: CreateSubscriptionRequestDto = {
        email: 'test@email.com',
        firstName: 'Wagner',
        gender: 'Other',
        dateOfBirth: new Date('1994-04-06').toISOString(),
        flagForConsent: true,
        newsletterId: 345,
      };

      const createdResponse = {
        id: 1,
        ...subscriptionRequest,
      };

      mockedSubscriptionService.createSubscription = jest.fn().mockResolvedValue(createdResponse);

      const app = new App([subscriptionsRoute]);
      const content = await request(app.getServer()).post(`${subscriptionsRoute.path}`).send(subscriptionRequest).expect(201);
      expect(mockedSubscriptionService.createSubscription).toHaveBeenCalled();
      expect(content.text).toContain(JSON.stringify(createdResponse));
    });
  });
});
