/*
  Warnings:

  - Added the required column `vaccinationStatus` to the `children` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "children" ADD COLUMN     "vaccinationStatus" BOOLEAN NOT NULL;
