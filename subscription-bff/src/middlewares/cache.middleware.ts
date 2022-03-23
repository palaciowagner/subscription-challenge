import { NextFunction, Request, RequestHandler, Response } from 'express';

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.use_express_redis_cache = res.statusCode.toString().startsWith('2');
    next();
  } catch (error) {
    next(error);
  }
};
