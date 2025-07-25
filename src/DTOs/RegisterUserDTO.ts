import { IdentificationType } from "@prisma/client";

export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  identificationType: IdentificationType;
  identification: string;
  password: string;
  phone: string;
  email: string;
  city: string;
  municipality: string;
  supervisorIdentification?: string;
  role: string;
  idClinic?: string;
}
