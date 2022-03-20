import axios from 'axios';
import { CORE_API_BASE_URL, CORE_API_TOKEN } from '@/config';

export const CoreApiClient = axios.create({
  baseURL: CORE_API_BASE_URL,
  timeout: 1000,
  headers: { 'X-Api-Token': CORE_API_TOKEN },
});
