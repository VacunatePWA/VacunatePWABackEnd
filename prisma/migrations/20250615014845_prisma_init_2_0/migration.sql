/*
  Warnings:

  - The primary key for the `appointments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `appointments` table. All the data in the column will be lost.
  - The primary key for the `children` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `guardianId` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `children` table. All the data in the column will be lost.
  - The primary key for the `clinics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `clinics` table. All the data in the column will be lost.
  - The primary key for the `guardians` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `guardians` table. All the data in the column will be lost.
  - You are about to drop the column `relationship` on the `guardians` table. All the data in the column will be lost.
  - The primary key for the `records` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `signature` on the `records` table. All the data in the column will be lost.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `roles` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `users` table. All the data in the column will be lost.
  - The primary key for the `vaccines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ageRangeMax` on the `vaccines` table. All the data in the column will be lost.
  - You are about to drop the column `ageRangeMin` on the `vaccines` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `vaccines` table. All the data in the column will be lost.
  - You are about to drop the column `maxDoses` on the `vaccines` table. All the data in the column will be lost.
  - You are about to drop the `states` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city` to the `children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `guardians` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('PASSPORT', 'IDCARD');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('MOTHER', 'FATHER', 'TUTOR');

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_childId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_userId_fkey";

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_guardianId_fkey";

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_stateId_fkey";

-- DropForeignKey
ALTER TABLE "clinics" DROP CONSTRAINT "clinics_stateId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_childId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_userId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_vaccineId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_stateId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_stateId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_supervisorId_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_pkey",
DROP COLUMN "id",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "idAppointment" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("idAppointment");

-- AlterTable
ALTER TABLE "children" DROP CONSTRAINT "children_pkey",
DROP COLUMN "address",
DROP COLUMN "guardianId",
DROP COLUMN "id",
DROP COLUMN "stateId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "idChild" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "identificationType" "IdentificationType" NOT NULL,
ADD COLUMN     "municipality" TEXT NOT NULL,
ADD CONSTRAINT "children_pkey" PRIMARY KEY ("idChild");

-- AlterTable
ALTER TABLE "clinics" DROP CONSTRAINT "clinics_pkey",
DROP COLUMN "address",
DROP COLUMN "id",
DROP COLUMN "stateId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "idClinic" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "municipality" TEXT NOT NULL,
ADD CONSTRAINT "clinics_pkey" PRIMARY KEY ("idClinic");

-- AlterTable
ALTER TABLE "guardians" DROP CONSTRAINT "guardians_pkey",
DROP COLUMN "id",
DROP COLUMN "relationship",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "idGuardian" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "identificationType" "IdentificationType" NOT NULL,
ADD CONSTRAINT "guardians_pkey" PRIMARY KEY ("idGuardian");

-- AlterTable
ALTER TABLE "records" DROP CONSTRAINT "records_pkey",
DROP COLUMN "id",
DROP COLUMN "signature",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "idRecord" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "records_pkey" PRIMARY KEY ("idRecord");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "id",
DROP COLUMN "stateId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idRole" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("idRole");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "stateId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "idUser" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD COLUMN     "identificationType" "IdentificationType" NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("idUser");

-- AlterTable
ALTER TABLE "vaccines" DROP CONSTRAINT "vaccines_pkey",
DROP COLUMN "ageRangeMax",
DROP COLUMN "ageRangeMin",
DROP COLUMN "id",
DROP COLUMN "maxDoses",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "idVaccine" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "vaccines_pkey" PRIMARY KEY ("idVaccine");

-- DropTable
DROP TABLE "states";

-- CreateTable
CREATE TABLE "guardian_child" (
    "idGuardianChild" UUID NOT NULL DEFAULT gen_random_uuid(),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "guardianId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "relationship" "Relationship" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guardian_child_pkey" PRIMARY KEY ("idGuardianChild")
);

-- CreateTable
CREATE TABLE "VaccineSchema" (
    "idVaccineSchema" UUID NOT NULL DEFAULT gen_random_uuid(),
    "idVaccine" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "Description" TEXT NOT NULL,
    "Doses" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VaccineSchema_pkey" PRIMARY KEY ("idVaccineSchema")
);

-- CreateIndex
CREATE UNIQUE INDEX "guardian_child_guardianId_childId_key" ON "guardian_child"("guardianId", "childId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("idRole") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "users"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian_child" ADD CONSTRAINT "guardian_child_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "guardians"("idGuardian") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardian_child" ADD CONSTRAINT "guardian_child_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("idChild") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("idChild") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_vaccineId_fkey" FOREIGN KEY ("vaccineId") REFERENCES "vaccines"("idVaccine") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_childId_fkey" FOREIGN KEY ("childId") REFERENCES "children"("idChild") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("idClinic") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccineSchema" ADD CONSTRAINT "VaccineSchema_idVaccine_fkey" FOREIGN KEY ("idVaccine") REFERENCES "vaccines"("idVaccine") ON DELETE RESTRICT ON UPDATE CASCADE;
