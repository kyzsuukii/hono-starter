import { validator } from "hono/validator";
import { z } from "zod";
import { validateSchema } from "./validator";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(20),
});

const loginValidation = validator("json", (value, ctx) => {
	return validateSchema(ctx, loginSchema, value);
});

const registerSchema = loginSchema.extend({
	name: z.string().min(4).max(40),
});

const registerValidation = validator("json", (value, ctx) => {
	return validateSchema(ctx, registerSchema, value);
});

type LoginBody = z.infer<typeof loginSchema>;
type RegisterBody = z.infer<typeof registerSchema>;

export {
	loginValidation,
	registerValidation,
	type LoginBody,
	type RegisterBody,
};
