import supertest from 'supertest';

const hook =
  (app: any, method: string = 'post') =>
  args => {
    return supertest(app)[method](args);
  };

const request = app => ({
  post: hook(app, 'post'),
  get: hook(app, 'get'),
  put: hook(app, 'put'),
  delete: hook(app, 'delete'),
});

export default request;
