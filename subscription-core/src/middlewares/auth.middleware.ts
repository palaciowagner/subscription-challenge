import { NextFunction, Request, Response } from 'express';
import {  compare } from 'bcrypt';
import { NODE_ENV, SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';

export const apiKeyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKeyHeader = (req.header('x-api-key') ? req.header('x-api-key') : null);

    const secretKey: string = SECRET_KEY;
    
    if (!apiKeyHeader){
      next(new HttpException(401, "Missing 'x-api-key' token as a header"));
    }

    let keysMatch = await compare(secretKey, apiKeyHeader);

    if (NODE_ENV === 'test'){
      keysMatch = await compare(apiKeyHeader, secretKey)
    }

    if (!keysMatch){
      next(new HttpException(401, 'Wrong API token provided'));
    }
    next();
  } catch (error) {
    console.log(error)
    next(new HttpException(401, 'Wrong or missing api key token provided'));
  }
};

export default apiKeyMiddleware;
