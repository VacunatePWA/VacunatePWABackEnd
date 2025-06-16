export interface AddRecordDTO {
  idRecord:string;
  userId:string;
  vaccineId:string;
  childId:string;
  dosesApplied: number;
  notes?: string;
}
