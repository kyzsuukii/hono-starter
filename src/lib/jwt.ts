import { sign, verify } from "hono/jwt";
import { env } from "./env";

type Payload = {
	[key: string]: unknown;
	exp?: number;
};

const createToken = async (id: string, email: string) => {
	const payload: Payload = {
		sub: id,
		email,
		exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
	};

	return sign(payload, env.SECRET_KEY);
};

const verifyToken = async (token: string): Promise<Payload> => {
	const payload = await verify(token, env.SECRET_KEY);
	return payload;
};

export { createToken, verifyToken, type Payload };
