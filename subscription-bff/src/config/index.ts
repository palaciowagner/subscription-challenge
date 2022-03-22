import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, CORE_API_TOKEN, CORE_API_BASE_URL, REDIS_CACHE_DURATION, REDIS_PORT, REDIS_HOST } =
  process.env;
