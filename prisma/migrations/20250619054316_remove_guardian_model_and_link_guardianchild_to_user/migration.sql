/*
  Warnings:

  - You are about to drop the column `childAgeAtMoment` on the `records` table. All the data in the column will be lost.
  - You are about to drop the column `recordNumber` on the `records` table. All the data in the column will be lost.
  - You are about to drop the `guardians` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `latitude` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `clinics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "guardian_child" DROP CONSTRAINT "guardian_child_guardianId_fkey";

-- DropIndex
DROP INDEX "records_recordNumber_key";

-- AlterTable
ALTER TABLE "VaccineSchema" ADD COLUMN     "active" BOOLEAN DEFAULT true;

-- AlterTable
ALTER TABLE "children" ALTER COLUMN "vaccinationStatus" SET DEFAULT false;

-- AlterTable
ALTER TABLE "clinics" ADD COLUMN     "latitude" REAL NOT NULL,
ADD COLUMN     "longitude" REAL NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "records" DROP COLUMN "childAgeAtMoment",
DROP COLUMN "recordNumber";

-- DropTable
DROP TABLE "guardians";

-- AddForeignKey
ALTER TABLE "guardian_child" ADD CONSTRAINT "guardian_child_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "users"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;
