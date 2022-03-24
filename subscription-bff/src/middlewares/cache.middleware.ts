import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

const NO_CACHE = 'no-cache';
export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheControlHeader = req.headers['cache-control'];
    if (!cacheControlHeader) {
      next();
      return;
    }
    if (cacheControlHeader.toString().toLowerCase() === NO_CACHE) {
      logger.info(`Skipping caching response for ${req.originalUrl}`);
      res.use_express_redis_cache = false;
    }
    next();
  } catch (error) {
    next(error);
  }
};
