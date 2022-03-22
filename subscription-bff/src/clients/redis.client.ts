import cache from 'express-redis-cache';
import { REDIS_HOST, REDIS_PORT, REDIS_CACHE_DURATION } from '@config';

const redisClient = () => cache({
  host: REDIS_HOST,
  port: REDIS_PORT,
  expire: Number(REDIS_CACHE_DURATION),
});

export default redisClient;
