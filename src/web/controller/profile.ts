import type { Context } from "hono";
import type { UserService } from "../services/user";
import { ERRORS, serveInternalServerError } from "./resp/error";
import { createToken, type Payload } from "../../lib/jwt";
import { serializeUser } from "./serializer/user";
import type { UpdateUser } from "../../lib/types";

export class ProfileController {
	private service: UserService;

	constructor(userService: UserService) {
		this.service = userService;

		this.update = this.update.bind(this);
	}

	public async update(ctx: Context) {
		const body: Partial<UpdateUser> = await ctx.req.json();

		const payload: Payload = ctx.get("jwtPayload");

		const user = await this.service.findByEmail(payload.email as string);

		if (!user) {
			return serveInternalServerError(ctx, ERRORS.USER_NOT_FOUND);
		}

		if (!body) {
			return serveInternalServerError(ctx, ERRORS.INVALID_VALUE);
		}

		await this.service.updateByEmail(payload.email as string, body);

		const updatedUser = { ...user, ...body };

		const token = await createToken(updatedUser.id, updatedUser.email);

		const serializedUser = serializeUser(updatedUser);

		return ctx.json({
			user: serializedUser,
			token,
		});
	}
}
