import supertest from 'supertest';

const hook =
  (app: any, method: string = 'post', authorizationKey) =>
  args => {
    return supertest(app)[method](args).set('Authorization', `Bearer ${authorizationKey}`);
  };

const request = (app, authorizationKey = 'secretKey') => ({
  post: hook(app, 'post', authorizationKey),
  get: hook(app, 'get', authorizationKey),
  put: hook(app, 'put', authorizationKey),
  delete: hook(app, 'delete', authorizationKey),
});

export default request;
