export interface RegisterUserDTO {
  name: string;
  identification: string,
  password: string,
  phone: string,
  email?: string,
  supervisor?: string 
  role: string,
  state: string
}

