import { z } from 'zod';

const loginInitSchema = {
  username: '',
  password: '',
};

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Insert your username' }),
  password: z.string().min(1, { message: 'Please provide your password' }),
});

export { loginInitSchema, loginSchema };
