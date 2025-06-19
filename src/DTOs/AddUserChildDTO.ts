export interface AddUserChildDTO {
  identificationUser: string;
  identificationChild: string;
  relationship: "MOTHER" | "FATHER" | "TUTOR";
}
