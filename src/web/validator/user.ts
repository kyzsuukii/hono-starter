import { validator } from "hono/validator";
import { z, type ZodObject } from "zod";
import { validateSchema } from "./validator";
import type { Context } from "hono";
import { ERRORS, serveUnprocessableEntity } from "../controller/resp/error";

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

const updateProfileSchema = z.object({
	name: z.string().min(4).max(40).nullable(),
	email: z.string().email().nullable(),
	password: z.string().min(8).max(20).nullable(),
});

const updateProfileValidation = validator("json", (value, ctx) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const validate = (ctx: Context, schema: ZodObject<any>, value: any) => {
		const providedKeys = Object.keys(value);
		if (providedKeys.length === 0) {
			return serveUnprocessableEntity(ctx, ERRORS.INVALID_VALUE);
		}

		const pickKeys = providedKeys.reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, true>);

		const partialSchema = schema.partial().pick(pickKeys);

		const parsed = partialSchema.safeParse(value);
		if (!parsed.success) {
			return serveUnprocessableEntity(ctx, ERRORS.INVALID_VALUE);
		}
		return parsed.data;
	};

	return validate(ctx, updateProfileSchema, value);
});

type LoginBody = z.infer<typeof loginSchema>;
type RegisterBody = z.infer<typeof registerSchema>;
type UpdateProfileBody = z.infer<typeof updateProfileSchema>;

export {
	loginValidation,
	registerValidation,
	updateProfileValidation,
	type LoginBody,
	type RegisterBody,
	type UpdateProfileBody,
};
