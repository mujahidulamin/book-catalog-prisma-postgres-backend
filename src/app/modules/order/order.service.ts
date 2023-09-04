/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';

const createOrder = async (user: any, payload: any) => {
  const { id } = user;

  const { orderedBooks } = payload;

  const result = await prisma.order.create({
    data: {
      userId: id,
      orderedBooks,
    },
  });
  return result;
};

const getAllOrder = async (user: any) => {
  const { role, id } = user;

  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (role === 'admin') {
    const result = await prisma.order.findMany({});

    return result;
  }
  if (role === 'customer') {
    const result = await prisma.order.findMany({
      where: {
        userId: id,
      },
    });

    return result;
  }
};

const getSingleOrderById = async (orderId: string, user: any) => {
  const { role, id } = user;

  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (role === 'customer') {
    const result = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: id,
      },
    });

    if (result?.userId !== id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not allowed to access this data.'
      );
    }

    return result;
  }

  if (role === 'admin') {
    const result = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    return result;
  }
};

export const OrderService = {
  createOrder,
  getAllOrder,
  getSingleOrderById,
};
