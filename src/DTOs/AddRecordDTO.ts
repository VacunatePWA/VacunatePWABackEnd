export interface AddRecordDTO {
  idRecord:string;
  identificationUser:string;
  vaccineName:string;
  identificationChild:string;
  dosesApplied: number;
  notes?: string;
}
