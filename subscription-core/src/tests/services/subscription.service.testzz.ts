import { CreateSubscriptionDto } from '@/dtos/subscriptions.dto';
import SubscriptionService from '@/services/subscriptions.service';
import * as typeorm from 'typeorm';

jest.mock('@/entities/subscription.entity', () => () => {
  return {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
});

import { SubscriptionEntity } from '@/entities/subscription.entity';
const MockedSubscriptionEntity = <jest.Mocked<typeof SubscriptionEntity>>SubscriptionEntity;
// const MockedSubscriptionEntity = jest.fn<SubscriptionEntity>(()=> ({}))

describe.skip('Subscription Service', () => {
  describe('when create a subscription', () => {
    const subscriptionService: SubscriptionService = new SubscriptionService();

//     beforeAll(async () => {
//       const subscription = {
//         email: 'test@email.com',
//         firstName: 'Wagner',
//         gender: 'Other',
//         dateOfBirth: new Date('1994-04-06').toISOString(),
//         flagForConsent: true,
//         newsletterId: 345,
//       };

//     //   const mock = {
//     //     create: jest.fn(),
//     //     save: jest.fn(),
//     //     findOne: jest.fn(),
//     //     prototype: undefined,
//     //     useConnection: jest.fn(),
//     //     getRepository: jest.fn(),
//     //     target: jest.fn(),
//     //     hasId: jest.fn(),
//     //     getId: jest.fn(),
//     //     createQueryBuilder: jest.fn(),
//     //     merge: jest.fn(),
//     //     preload: jest.fn(),
//     //     remove: jest.fn(),
//     //     softRemove: jest.fn(),
//     //     insert: jest.fn(),
//     //     update: jest.fn(),
//     //     upsert: jest.fn(),
//     //     delete: jest.fn(),
//     //     count: jest.fn(),
//     //     find: jest.fn(),
//     //     findAndCount: jest.fn(),
//     //     findByIds: jest.fn(),
//     //     findOneOrFail: jest.fn(),
//     //     query: jest.fn(),
//     //     clear: jest.fn(),
//     //   };

//       //   MockedSubscriptionEntity.create = jest.fn().mockImplementation(() => () => subscription);
//       //   MockedSubscriptionEntity.save = jest.fn().mockImplementation(() => () => {});
//       //   SubscriptionEntity.findOne = jest.fn();

//       const subscriptionRequest: CreateSubscriptionDto = subscription;

//       await subscriptionService.createSubscription(subscriptionRequest);
//     });

//     it('should save on database', () => {
//       expect(MockedSubscriptionEntity.create).toHaveBeenCalled();
//     });

//     it('should send an email', () => {
//       // given
//       // when
//       //then
//     });
  });
});
