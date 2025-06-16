export interface AddClinicDTO {
  name: string;
  shortName: string;
  city: string;
  municipality: string;
  street:string;
  phone: string;
  director: string;
  website?: string;
  email?: string;
  longitude: number;
  latitude:number;
}
