import { z } from 'zod';
import { userRoleFields } from '../../../constants/user';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'FirstName is required!',
    }),
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
    role: z.enum([...userRoleFields] as [string, ...string[]], {
      required_error: 'Role is required!',
    }).optional(),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});


export const AuthUserValidation = {
  createUserZodSchema,
  loginZodSchema
};
