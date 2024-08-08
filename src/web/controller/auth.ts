import type { Context } from "hono";
import type { UserService } from "../services/user";
import type { LoginBody, RegisterBody } from "../validator/user";
import {
	ERRORS,
	serveBadRequest,
	serveInternalServerError,
	serveUnauthorized,
} from "./resp/error";
import { verify } from "../../lib/crypto";
import { createToken, type Payload } from "../../lib/jwt";
import { serializeUser } from "./serializer/user";
import { type DatabaseError, DB_ERRORS } from "../../lib/db";

export class AuthController {
	private service: UserService;

	constructor(userService: UserService) {
		this.service = userService;

        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.userinfo = this.userinfo.bind(this);
	}

	public async login(ctx: Context) {
		const body: LoginBody = await ctx.req.json();

		const user = await this.service.findByEmail(body.email);

		if (!user) {
			return serveUnauthorized(ctx);
		}

		const isVerified = verify(body.password, user.password);

		if (!isVerified) {
			return serveUnauthorized(ctx);
		}

		const token = await createToken(user.id, user.email);

		const serializedUser = serializeUser(user);

		return ctx.json({
			user: serializedUser,
			token,
		});
	}

	public async register(ctx: Context) {
        const body: RegisterBody = await ctx.req.json();

        try {
            await this.service.create(body.name, body.email, body.password);
        } catch (err: unknown) {
            const e = err as DatabaseError;
            if (e.code === DB_ERRORS.DUPLICATE_KEY) {
                return serveBadRequest(ctx, ERRORS.USER_EXISTS);
            }

            return serveInternalServerError(ctx, err);
        }

		const user = await this.service.findByEmail(body.email);
		if (!user) {
            return serveInternalServerError(ctx, new Error(ERRORS.USER_NOT_FOUND));
        }

        const token = await createToken(user.id, user.email);
		const serializedUser = serializeUser(user);

		return ctx.json({
			user: serializedUser,
            token,
		});
	}

	public async userinfo(ctx: Context) {
		const payload: Payload = ctx.get("jwtPayload");
		const user = await this.service.findByEmail(payload.email as string);
		if (!user) {
			return serveInternalServerError(ctx, new Error(ERRORS.USER_NOT_FOUND));
		}

		const serializedUser = serializeUser(user);
		return ctx.json({ user: serializedUser });
	}
}
