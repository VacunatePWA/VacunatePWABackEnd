import { Relationship } from "@prisma/client";

export interface AddGuardianChildDTO {
  identificationGuardian: string;
  identificationChild: string;
  relationship: Relationship;
}
