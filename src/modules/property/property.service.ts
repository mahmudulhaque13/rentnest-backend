import prisma from "../../lib/prisma";

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

export const propertyService = {
  createProperty,
  getAllProperties,
};
