/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

export const signUpUser = async (data: User) => {
  const isExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already exist');
  }

  //hash the user password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const result = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: false,
      role: true,
      contactNo: true,
      address: true,
      profileImg: true,
    },
  });

  if (!result) {
    throw new ApiError(404, 'Something Went wrong');
  }
  return result;
};

const signInUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User does not exist');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Your password is not correct');
  }

  //create access token

  const token = jwtHelpers.createToken(
    { email: user.email, role: user.role, id: user.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    token,
  };
  
};
export const AuthService = {
  signUpUser,
  signInUser,
};
