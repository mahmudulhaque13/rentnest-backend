import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import AppError from "../../utils/appError";
import { ICreateRentalRequest } from "./rentalRequest.interface";

const createRentalRequest = async (
  payload: ICreateRentalRequest,
  tenantId: string,
) => {
  // Check Property
  const property = await prisma.property.findFirst({
    where: {
      id: payload.propertyId,
      isDeleted: false,
    },
  });

  if (!property) {
    throw new AppError(httpStatus.NOT_FOUND, "Property not found");
  }

  // Property Available?
  if (property.status !== "AVAILABLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "Property is not available");
  }

  // Own Property?
  if (property.landlordId === tenantId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You cannot rent your own property",
    );
  }

  // Already Requested?
  const isRequested = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      tenantId,
      status: "PENDING",
    },
  });

  if (isRequested) {
    throw new AppError(httpStatus.CONFLICT, "Rental request already exists");
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      propertyId: payload.propertyId,
      tenantId,
      moveInDate: new Date(payload.moveInDate),
      message: payload.message,
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return rentalRequest;
};

const getMyRentalRequests = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        include: {
          category: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const getLandlordRentalRequests = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const approveRentalRequest = async (requestId: string, landlordId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: true,
    },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (request.status === "APPROVED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request already approved",
    );
  }

  if (request.status === "REJECTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request already rejected",
    );
  }

  if (request.property.status !== "AVAILABLE") {
    throw new AppError(httpStatus.BAD_REQUEST, "Property is not available");
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.rentalRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "APPROVED",
      },
    });

    await tx.property.update({
      where: {
        id: request.propertyId,
      },
      data: {
        status: "RENTED",
      },
    });

    return updatedRequest;
  });

  return result;
};

const rejectRentalRequest = async (requestId: string, landlordId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
    include: {
      property: true,
    },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (request.status === "APPROVED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Approved request cannot be rejected",
    );
  }

  if (request.status === "REJECTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental request already rejected",
    );
  }

  const rejectedRequest = await prisma.rentalRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "REJECTED",
    },
  });

  return rejectedRequest;
};

const cancelRentalRequest = async (requestId: string, tenantId: string) => {
  const request = await prisma.rentalRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    throw new AppError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (request.tenantId !== tenantId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
  }

  if (request.status === "APPROVED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Approved request cannot be cancelled",
    );
  }

  if (request.status === "REJECTED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rejected request cannot be cancelled",
    );
  }

  const deletedRequest = await prisma.rentalRequest.delete({
    where: {
      id: requestId,
    },
  });

  return deletedRequest;
};

export const rentalRequestService = {
  createRentalRequest,
  getMyRentalRequests,
  getLandlordRentalRequests,
  approveRentalRequest,
  rejectRentalRequest,
  cancelRentalRequest,
};
