import { z } from "zod";


export const signInSchema = z.object({
    identifier: z.string().email({ message: "Invalid email adress" }),
    password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters")
})