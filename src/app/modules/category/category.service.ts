import { Category } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

const createCategory = async (data: Category): Promise<Category> => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

const getAllCategory = async (): Promise<Category[]> => {
  const result = await prisma.category.findMany();
  return result;
};

const getSingleCategory = async (id: string) => {
  const Category = await prisma.category.findUnique({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });
  return Category;
};

const updateCategory = async (id: string, payload: Partial<Category>) => {
  const Category = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return Category;
};

const deleteCategory = async (id: string) => {
  const Category = await prisma.category.delete({
    where: {
      id,
    },
  });
  return Category;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
