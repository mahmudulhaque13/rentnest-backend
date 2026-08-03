import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

const createProperty = async (payload: any, landlordId: string) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
  });

  return property;
};

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    where: {
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
  getSingleProperty,
  updateProperty,
  deleteProperty,
};
