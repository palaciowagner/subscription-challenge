import { HttpException } from '@/exceptions/HttpException';
export const errorHandler = error => {
  const {
    response: { status, data: message },
  } = error;

  if (!status.toString().startsWith(2)) {
    throw new HttpException(status, message.message);
  }
};
