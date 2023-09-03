import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
// import config from '../../../config';

const signUpUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signUpUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User created successfully',
    data: result,
  });
});

const signInUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signInUser(req.body);

 

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: result,
  });
});
export const AuthController = {
    signUpUser,
    signInUser,
};
