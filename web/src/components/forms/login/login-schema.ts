import { z } from 'zod';
export const LoginSchema = z.object({
    login: z.string(),
    password: z.string(),
});
