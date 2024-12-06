import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleat of 4  characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")


export const emailValidation = z.string().email({ message: "Invalid email adress" });
export const passwordValidation = z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be less than 20 characters");


export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})