import { z } from 'zod';
import { Gender, IdentificationType, Relationship } from '@prisma/client';

const VaccineRecordSchema = z.object({
  vaccineName: z.string(),
  dosesApplied: z.number().int().min(0),
  notes: z.string().optional().nullable(),
  applicationDate: z.string().datetime().optional().nullable(),
});

const UserSchema = z.object({
  identification: z.string(),
  identificationType: z.nativeEnum(IdentificationType),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

const RelationshipSchema = z.object({
  identificationUser: z.string(),
  identificationChild: z.string(),
  relationship: z.nativeEnum(Relationship)
});

const ChildSchema = z.object({
    idChild: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    identificationType: z.nativeEnum(IdentificationType),
    identification: z.string(),
    birthDate: z.string().refine((date) => {
      // Permitir tanto formato de fecha ISO como formato de fecha simple
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return isoRegex.test(date) || dateRegex.test(date);
    }, { message: "Invalid date format. Expected ISO datetime or YYYY-MM-DD" }),
    gender: z.nativeEnum(Gender),
    nationality: z.string(),
    city: z.string(),
    municipality: z.string(),
});

const ChildCreateSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    identificationType: z.nativeEnum(IdentificationType),
    identification: z.string(),
    birthDate: z.string().refine((date) => {
      // Permitir tanto formato de fecha ISO como formato de fecha simple
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return isoRegex.test(date) || dateRegex.test(date);
    }, { message: "Invalid date format. Expected ISO datetime or YYYY-MM-DD" }),
    gender: z.nativeEnum(Gender),
    nationality: z.string(),
    city: z.string(),
    municipality: z.string(),
});

export const createChildWithTutorSchema = z.object({
  child: ChildCreateSchema,
  users: z.array(UserSchema).optional(),
  tutorId: z.string().optional(),
  vaccineRecords: z.array(VaccineRecordSchema).optional(),
  relationships: z.array(RelationshipSchema).optional(),
});

export const updateChildWithTutorSchema = z.object({
  child: ChildSchema,
  users: z.array(UserSchema).optional(),
  tutorId: z.string().optional(),
  vaccineRecords: z.array(VaccineRecordSchema).optional(),
  relationships: z.array(RelationshipSchema).optional(),
}); 