import request from '../utils/request.hook';
import { createConnection, getRepository } from 'typeorm';
import App from '@/app';
import { dbConnection } from '@/connections/db.connection';
import { CreateSubscriptionDto } from '@dtos/subscriptions.dto';
import SubscriptionsRoute from '@routes/subscription.route';
import { SubscriptionEntity } from '@/entities/subscription.entity';

jest.mock('@/producers/email.producer');

beforeAll(async () => {
  await createConnection(dbConnection);
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Subscriptions Integration Tests', () => {
  describe('[POST] /subscriptions', () => {
    it('should return 201 and create a new Subscription if it does not exist', async () => {
      const subscriptionRequest: CreateSubscriptionDto = {
        email: 'test@email.com',
        firstName: 'Wagner',
        gender: 'Other',
        dateOfBirth: new Date('1994-04-06').toISOString(),
        flagForConsent: true,
        newsletterId: 345,
      };

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionsRepository = getRepository(SubscriptionEntity);
      const emailProducerMock = subscriptionsRoute.subscriptionsController.subscriptionService.emailProducer;

      subscriptionsRepository.save = jest.fn().mockReturnValue({
        id: 1,
        email: subscriptionRequest.email,
        firstName: subscriptionRequest.firstName,
        gender: subscriptionRequest.gender,
        dateOfBirth: subscriptionRequest.dateOfBirth,
        flagForConsent: subscriptionRequest.flagForConsent,
        newsletterId: subscriptionRequest.newsletterId,
        createdAt: new Date(),
        modifiedAt: new Date(),
      });

      emailProducerMock.send = jest.fn();
      const findOneSpy = jest.spyOn(subscriptionsRepository, 'findOne');

      const app = new App([subscriptionsRoute]);

      await request(app.getServer()).post(`${subscriptionsRoute.path}`).send(subscriptionRequest).expect(201);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(emailProducerMock.send).toHaveBeenCalledTimes(1);
      expect(subscriptionsRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return 409 CONFLICT when e-mail already exists and is active', async () => {
      const subscriptionRequest: CreateSubscriptionDto = {
        email: 'another-test@email.com',
        firstName: 'Maria',
        gender: 'non-binary',
        dateOfBirth: new Date('1993-12-30').toISOString(),
        flagForConsent: true,
        newsletterId: 39439,
      };

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionsRepository = getRepository(SubscriptionEntity);
      const emailProducerMock = subscriptionsRoute.subscriptionsController.subscriptionService.emailProducer;

      const mockFindOne = {
        id: 1,
        email: subscriptionRequest.email,
        firstName: subscriptionRequest.firstName,
        gender: subscriptionRequest.gender,
        dateOfBirth: subscriptionRequest.dateOfBirth,
        flagForConsent: subscriptionRequest.flagForConsent,
        newsletterId: subscriptionRequest.newsletterId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isActive: true,
      };

      subscriptionsRepository.findOne = jest.fn().mockReturnValue(mockFindOne);
      emailProducerMock.send = jest.fn();

      const app = new App([subscriptionsRoute]);
      const content = await request(app.getServer()).post(`${subscriptionsRoute.path}`).send(subscriptionRequest).expect(409);

      expect(subscriptionsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(emailProducerMock.send).not.toHaveBeenCalled();
      expect(content.text).toContain('{"message":"A subscription for another-test@email.com already exists"}');
    });

    it('should activate a subscription if email exists but its currently deactivated', async () => {
      const subscriptionRequest: CreateSubscriptionDto = {
        email: 'test@email.com',
        firstName: 'Wagner',
        gender: 'Other',
        dateOfBirth: new Date('1994-04-06').toISOString(),
        flagForConsent: true,
        newsletterId: 345,
      };

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionsRepository = getRepository(SubscriptionEntity);
      const emailProducerMock = subscriptionsRoute.subscriptionsController.subscriptionService.emailProducer;

      const mockFindOne = {
        id: 1,
        email: subscriptionRequest.email,
        firstName: subscriptionRequest.firstName,
        gender: subscriptionRequest.gender,
        dateOfBirth: subscriptionRequest.dateOfBirth,
        flagForConsent: subscriptionRequest.flagForConsent,
        newsletterId: subscriptionRequest.newsletterId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isActive: false,
      };

      subscriptionsRepository.findOne = jest
        .fn()
        .mockReturnValueOnce({ ...mockFindOne })
        .mockReturnValueOnce({ ...mockFindOne, isActive: true });

      const updateSpy = jest.spyOn(subscriptionsRepository, 'update');
      emailProducerMock.send = jest.fn();

      const app = new App([subscriptionsRoute]);
      const content = await request(app.getServer()).post(`${subscriptionsRoute.path}`).send(subscriptionRequest).expect(201);

      expect(subscriptionsRepository.findOne).toHaveBeenCalledTimes(2);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(emailProducerMock.send).toHaveBeenCalledTimes(1);
      expect(content.text).toContain('"isActive":true');
    });

    it('should return 401 Unauthorized when Api Token is wrong', async () => {
      const subscriptionRequest: CreateSubscriptionDto = {
        email: 'test@email.com',
        firstName: 'Wagner',
        gender: 'Other',
        dateOfBirth: new Date('1994-04-06').toISOString(),
        flagForConsent: true,
        newsletterId: 345,
      };

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionsRepository = getRepository(SubscriptionEntity);

      const app = new App([subscriptionsRoute]);
      return await request(app.getServer())
        .post(`${subscriptionsRoute.path}`)
        .set('X-Api-Key', `ANOTHER-WRONG-KEY`)
        .send(subscriptionRequest)
        .expect(401);
    });
  });

  describe('[GET] /subscriptions/:email', () => {
    it('should return 200 the desired subscription if exists and its content', async () => {
      const subscriptionEmail = 'test@email.com';

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: 'test@email.com',
        firstName: 'Wagner',
        gender: 'Other',
        dateOfBirth: new Date('1994-04-06').toISOString(),
        flagForConsent: true,
        newsletterId: 345,
      });

      const app = new App([subscriptionsRoute]);
      return request(app.getServer()).get(`${subscriptionsRoute.path}/${subscriptionEmail}`).expect(200);
    });

    it('should return 404 when subscription does not exist', async () => {
      const subscriptionEmail = 'non-existent@email.com';

      const subscriptionsRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.findOne = jest.fn().mockReturnValue(undefined);

      const app = new App([subscriptionsRoute]);
      return request(app.getServer()).get(`${subscriptionsRoute.path}/${subscriptionEmail}`).expect(404);
    });
  });

  describe('[GET] /subscriptions', () => {
    it('should return 200 and a list with all subscriptions', async () => {
      const subscriptionRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.find = jest.fn().mockReturnValue([
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
      ]);

      const app = new App([subscriptionRoute]);
      return request(app.getServer()).get(`${subscriptionRoute.path}`).expect(200);
    });

    it('should return 204 NO CONTENT when there are no subscriptions', async () => {
      const subscriptionRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.find = jest.fn().mockReturnValue([]);

      const app = new App([subscriptionRoute]);
      return request(app.getServer()).get(`${subscriptionRoute.path}`).expect(204);
    });
  });

  describe('[PUT] /subscriptions/:email/cancel', () => {
    it('should return 200 and cancel an existing subscription', () => {
      const subscriptionEmail = 'an-email@test.com';

      const subscriptionRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.findOne = jest.fn().mockReturnValue({
        id: 2,
        email: subscriptionEmail,
        firstName: 'Jose',
        gender: 'Male',
        dateOfBirth: new Date('1980-05-01').toISOString(),
        flagForConsent: true,
        newsletterId: 395304,
      });
      subscriptionRepository.update = jest.fn().mockReturnValue({
        generatedMaps: [],
        raw: [],
        affected: 1,
      });

      const app = new App([subscriptionRoute]);
      return request(app.getServer()).put(`${subscriptionRoute.path}/${subscriptionEmail}/cancel`).expect(200);
    });

    it('should return 404 when subscription does not exist', async () => {
      const subscriptionEmail = 'an-email@test.com';

      const subscriptionRoute = new SubscriptionsRoute();
      const subscriptionRepository = getRepository(SubscriptionEntity);

      subscriptionRepository.findOne = jest.fn().mockReturnValue(undefined);

      const app = new App([subscriptionRoute]);
      return request(app.getServer()).put(`${subscriptionRoute.path}/${subscriptionEmail}/cancel`).expect(404);
    });
  });
});
