import supertest from 'supertest';

const hook =
  (app: any, method: string = 'post', apiKey = 'secretKey') =>
  args => {
    return supertest(app)[method](args).set('X-Api-Key', `${apiKey}`);
  };

const request = app => ({
  post: hook(app, 'post'),
  get: hook(app, 'get'),
  put: hook(app, 'put'),
  delete: hook(app, 'delete'),
});

export default request;
