import axios from 'axios';
import { CORE_API_BASE_URL, CORE_API_TOKEN } from '@/config';
import { errorHandler } from '@/handlers/error.handler';

const CoreApiClient = () => {
  const client = axios.create({
    baseURL: CORE_API_BASE_URL,
    timeout: 1000,
    headers: { 'X-Api-Key': CORE_API_TOKEN },
  });
  client.interceptors.response.use(response => response, errorHandler);
  return client;
};

export default CoreApiClient;
