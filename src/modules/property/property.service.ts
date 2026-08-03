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

export const propertyService = {
  createProperty,
};
