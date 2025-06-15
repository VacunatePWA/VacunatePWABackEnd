import { IdentificationType } from "@prisma/client";

export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  identificationType: IdentificationType;
  identification: string;
  password: string;
  phone: string;
  email: string;
  supervisor: string | null;
  role: string;
  active: boolean;
}
