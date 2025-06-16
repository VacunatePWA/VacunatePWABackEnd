import { AppointmentState } from "@prisma/client";

export interface AddAppointmentDTO {
  date : Date;
  notes : string;
  state: AppointmentState;
  identificationChild:string;
  clinicName:string;
  identificationUser:string;
}
