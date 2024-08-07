import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
	PORT: z.string().default("3000"),
	LOG_LEVEL: z.string().default("info"),
	NODE_ENV: z.string().default("development"),
	SECRET_KEY: z.string(),
	DB_HOST: z.string().default("localhost"),
	DB_PORT: z.string().default("3306"),
	DB_USER: z.string().default("root"),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
