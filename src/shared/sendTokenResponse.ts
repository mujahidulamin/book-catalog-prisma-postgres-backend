import { Response } from 'express';

type IApiTokenReponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    size: number;
    total: number;
  };
  token?: T | null;
};

const sendTokenResponse = <T>(res: Response, data: IApiTokenReponse<T>): void => {
  const responseData: IApiTokenReponse<T> = {
    success: data.success,
    statusCode: data.statusCode,
    message: data.message || null,
    meta: data.meta || null || undefined,
    token: data.token || null || undefined,
  };

  res.status(data.statusCode).json(responseData);
};

export default sendTokenResponse;
