import { Gender, IdentificationType } from "@prisma/client";

export interface AddChildDTO {
  firstName: string;
  lastName: string;
  identificationType : IdentificationType;
  identification : string;
  birthDate : Date;
  gender : Gender;
  nationality : string;
  city: string;
  municipality: string;
}
