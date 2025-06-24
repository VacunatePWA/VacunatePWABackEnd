import { z } from "zod";

const userSchema = z.object({
  firstName: z.string({ required_error: "FirstName is required" }),

  lastName: z.string({ required_error: "LastName is required" }),

  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email" }),

  identification: z.string({ required_error: "Identification is required" }),

  identificationType: z.string({
    required_error: "Identification type is required",
  }),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),

  phone: z.string({ required_error: "Phone is required" }),

  city: z.string({ required_error: "City is required" }),

  municipality: z.string({ required_error: "Municipality is required" }),

  role: z.string({ required_error: "Role is required" }),

  // supervisor: z.string({ required_error: "Supervisor is required" }),
});

export default userSchema;
