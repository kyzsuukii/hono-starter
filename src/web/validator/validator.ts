import type { ZodError, ZodObject } from "zod";
import { serveUnprocessableEntity } from "../controller/resp/error";
import type { Context } from "hono";

const getErrorPhrase = (error: ZodError) => {
    const path = error.issues[0].path[0];
    const message = error.issues[0].message;
    return `${path}: ${message}`;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const validateSchema = (ctx: Context, schema: ZodObject<any>, value: any) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
        return serveUnprocessableEntity(ctx, getErrorPhrase(parsed.error));
    }
    return parsed.data;
};

export { getErrorPhrase, validateSchema };