import { AppointmentState } from "@prisma/client";

export interface AddAppointmentDTO {
  date : Date;
  notes : string;
  state: AppointmentState;
  identificationChild:string;
  clinicId:string;
  identificationUser:string;
}
