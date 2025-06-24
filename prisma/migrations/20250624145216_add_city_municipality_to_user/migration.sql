/*
  Warnings:

  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "children_identification_key";

-- DropIndex
DROP INDEX "clinics_name_key";

-- DropIndex
DROP INDEX "users_identification_key";

-- DropIndex
DROP INDEX "vaccines_name_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "municipality" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user_clinics" (
    "idUserClinic" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_clinics_pkey" PRIMARY KEY ("idUserClinic")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_clinics_userId_clinicId_key" ON "user_clinics"("userId", "clinicId");

-- AddForeignKey
ALTER TABLE "user_clinics" ADD CONSTRAINT "user_clinics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("idClinic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_clinics" ADD CONSTRAINT "user_clinics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
