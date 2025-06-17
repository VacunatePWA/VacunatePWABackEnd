import { IdentificationType } from "@prisma/client";

export interface AddGuardianDTO {
  firstName: string;
  lastName: string;
  identificationType: IdentificationType;
  identification: string;
  email: string;
  phone: string;
  city?: string;         
  municipality?: string; 
}
