import { z } from 'zod'
export const SignUp = z.object({
    firstname: z.string().min(2, 'First name should be at least 2 characters long'),
    lastname: z.string().min(2, 'Last name should be at least 2 characters long'),
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password should be at least 6 characters long'),
    terms: z.literal(true, { message: 'You must accept the terms and conditions' }),
})

export const Login = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(6, 'Password should be at least 6 characters long'),
})