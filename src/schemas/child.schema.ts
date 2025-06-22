import { z } from 'zod';
import { Gender, IdentificationType } from '@prisma/client';

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

const ChildSchema = z.object({
    idChild: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    identificationType: z.nativeEnum(IdentificationType),
    identification: z.string(),
    birthDate: z.string().datetime(),
    gender: z.nativeEnum(Gender),
    nationality: z.string(),
    city: z.string(),
    municipality: z.string(),
});

export const updateChildWithTutorSchema = z.object({
  child: ChildSchema,
  users: z.array(UserSchema).optional(),
  tutorId: z.string().optional(),
  vaccineRecords: z.array(VaccineRecordSchema).optional(),
}); 