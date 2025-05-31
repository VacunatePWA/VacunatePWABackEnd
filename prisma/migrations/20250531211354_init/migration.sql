-- CreateEnum
CREATE TYPE "AppointmentState" AS ENUM ('PENDING', 'CANCELLED', 'DONE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "supervisorId" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "State" (
    "id" UUID NOT NULL,
    "type" BOOLEAN NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guardian" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "relation" TEXT NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "maxDose" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Vaccination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinics" (
    "id" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "shorName" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "bornday" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "current" BOOLEAN NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "vaccinationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dateApply" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dosesApply" INTEGER NOT NULL,
    "ageAtMoment" INTEGER NOT NULL,
    "signature" BYTEA NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "clinicId" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "AppointmentState" NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_identification_key" ON "User"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Clinics_name_key" ON "Clinics"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Record_name_key" ON "Record"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinics" ADD CONSTRAINT "Clinics_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_vaccinationId_fkey" FOREIGN KEY ("vaccinationId") REFERENCES "Vaccination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
