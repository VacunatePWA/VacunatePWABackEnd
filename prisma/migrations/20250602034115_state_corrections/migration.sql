/*
  Warnings:

  - You are about to drop the column `state` on the `appointments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "state",
ADD COLUMN     "appointmentState" "AppointmentState" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "children" ALTER COLUMN "stateId" SET DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';

-- AlterTable
ALTER TABLE "clinics" ALTER COLUMN "stateId" SET DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';

-- AlterTable
ALTER TABLE "guardians" ADD COLUMN     "stateId" UUID NOT NULL DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "stateId" SET DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "stateId" SET DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';

-- AlterTable
ALTER TABLE "vaccines" ADD COLUMN     "stateId" UUID NOT NULL DEFAULT '975c46bb-456e-4869-9584-7aedfa5df92f';
