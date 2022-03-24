import { HttpException } from '@/exceptions/HttpException';
import { logger } from '@/utils/logger';
export const errorHandler = error => {
  logger.error('A downstream error occured');
  if (error && error.response) {
    const {
      response: { status, data: message },
    } = error;

    if (!status.toString().startsWith('2')) {
      throw new HttpException(status, message.message);
    }
  }
};
