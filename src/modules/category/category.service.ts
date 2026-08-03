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

export const categoryService = {
  createCategory,
};
