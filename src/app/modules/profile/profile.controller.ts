import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProfileService } from './profile.service';

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ProfileService.getUserProfile(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Retrieved successfully',
    data: result,
  });
});

export const ProfileController = {
  getUserProfile,
};
