/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,propertyId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Review_tenantId_propertyId_key" ON "Review"("tenantId", "propertyId");
