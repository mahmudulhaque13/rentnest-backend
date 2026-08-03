import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";
import { ICreateCategory } from "./category.interface";

const createCategory = async (payload: ICreateCategory) => {
  const isCategoryExists = await prisma.category.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug: payload.slug,
        },
      ],
    },
  });

  if (isCategoryExists) {
    throw new AppError(httpStatus.CONFLICT, "Category already exists");
  }

  const category = await prisma.category.create({
    data: payload,
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICreateCategory>,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Duplicate check
  if (payload.name || payload.slug) {
    const isExists = await prisma.category.findFirst({
      where: {
        OR: [
          payload.name ? { name: payload.name } : {},
          payload.slug ? { slug: payload.slug } : {},
        ],
        NOT: {
          id,
        },
      },
    });

    if (isExists) {
      throw new AppError(httpStatus.CONFLICT, "Category already exists");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id,
    },
  });

  return deletedCategory;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
