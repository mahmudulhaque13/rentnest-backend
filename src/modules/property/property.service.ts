import { Prisma } from "@prisma/client";
import httpStatus from "http-status";

import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";
import { IPropertyQuery } from "./property.interface";
import slugify from "slugify";

const propertySearchableFields = [
  "title",
  "city",
  "district",
  "address",
] as const;

const createProperty = async (payload: any, landlordId: string) => {
  const baseSlug = slugify(payload.title, {
    lower: true,
    strict: true,
  });

  const slug = `${baseSlug}-${Date.now()}`;

  const property = await prisma.property.create({
    data: {
      ...payload,
      slug,
      landlordId,
    },
  });

  return property;
};

const getAllProperties = async (query: IPropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = (query.sortOrder || "desc") as Prisma.SortOrder;

  const andConditions: Prisma.PropertyWhereInput[] = [
    {
      isDeleted: false,
    },
  ];

  // Search
  if (query.searchTerm) {
    andConditions.push({
      OR: propertySearchableFields.map((field) => ({
        [field]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Filter
  const { city, district, categoryId, status } = query;

  if (city) {
    andConditions.push({ city });
  }

  if (district) {
    andConditions.push({ district });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (status) {
    andConditions.push({
      status: status as any,
    });
  }

  // Rent Range Filter
  if (query.minRent || query.maxRent) {
    andConditions.push({
      rent: {
        gte: query.minRent ? Number(query.minRent) : undefined,
        lte: query.maxRent ? Number(query.maxRent) : undefined,
      },
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  });

  const total = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: properties,
  };
};

const getMyProperties = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: {
      landlordId,
      isDeleted: false,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const getSingleProperty = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: true,
      reviews: true,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  return property;
};

const updateProperty = async (id: string, payload: any, landlordId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this property",
    );
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedProperty;
};

const updatePropertyAvailability = async (
  id: string,
  status: "AVAILABLE" | "UNAVAILABLE",
  landlordId: string,
) => {
  const property = await prisma.property.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this property",
    );
  }

  // A rented property cannot be manually changed
  // through the availability toggle.
  if (property.status === "RENTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rented property availability cannot be changed",
    );
  }

  const updatedProperty = await prisma.property.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return updatedProperty;
};

const deleteProperty = async (id: string, landlordId: string) => {
  const property = await prisma.property.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  if (property.landlordId !== landlordId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this property",
    );
  }

  const deletedProperty = await prisma.property.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return deletedProperty;
};

export const propertyService = {
  createProperty,
  getAllProperties,
  getMyProperties,
  getSingleProperty,
  updateProperty,
  updatePropertyAvailability,
  deleteProperty,
};
