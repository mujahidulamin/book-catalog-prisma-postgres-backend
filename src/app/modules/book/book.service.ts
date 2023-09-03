/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { bookSearchableFields } from './book.constants';

const createBook = async (payload: Book): Promise<Book> => {
  const result = await prisma.book.create({
    data: payload,
    include: {
      category: true,
    },
  });
  return result;
};

const getAllBook = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { search, category, minPrice, maxPrice, ...filtersData }: any = filters;

  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  // Convert minPrice and maxPrice to floats
  const minPriceFloat = parseFloat(minPrice);
  const maxPriceFloat = parseFloat(maxPrice);
  if (!isNaN(minPriceFloat)) {
    andConditions.push({
      price: {
        gte: minPriceFloat,
      },
    });
  }

  if (!isNaN(maxPriceFloat)) {
    andConditions.push({
      price: {
        lte: maxPriceFloat,
      },
    });
  }

  if (category !== undefined) {
    andConditions.push({
      categoryId: {
        equals: category,
      },
    });
  }
  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: whereConditions,
    skip,
    take: size,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
  });
  const total = await prisma.book.count({
    where: whereConditions,
  });
  const totalPage = Math.ceil(total / size);
  return {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: result,
  };
};

const getBooksByCategoryId = async (
  id: string,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.book.findMany({
    where: {
      categoryId: id,
    },
    skip,
    take: size,
    orderBy:
      paginationOptions.sortBy && paginationOptions.sortOrder
        ? { [paginationOptions.sortBy]: paginationOptions.sortOrder }
        : { createdAt: 'desc' },
    include: {
      category: true,
    },
  });
  // const total = await prisma.book.count();
  const total = await prisma.book.count({
    where: {
      categoryId: id,
    },
  });
  const totalPage = Math.ceil(total / size);
  return {
    meta: {
      total,
      page,
      size,
      totalPage,
    },
    data: result,
  };
};

const getSingleBook = async (id: string) => {
  const Book = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return Book;
};

const updateBook = async (id: string, payload: Partial<Book>) => {
  const Book = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
    include: {
      category: true,
    },
  });
  return Book;
};

const deleteBook = async (id: string) => {
  const Book = await prisma.book.delete({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return Book;
};

export const BookService = {
  createBook,
  getAllBook,
  getBooksByCategoryId,
  getSingleBook,
  updateBook,
  deleteBook,
};
