import { Hono } from "hono";
import {
	serveInternalServerError,
	serveNotFound,
} from "./controller/resp/error";
import { UserRepository } from "./repository/user";
import { UserService } from "./services/user";
import { AuthController } from "./controller/auth";
import { jwt } from "hono/jwt";
import { env } from "../lib/env";
import { loginValidation, registerValidation } from "./validator/user";

export class Routes {
	private app: Hono;

	constructor(app: Hono) {
		this.app = app;
	}

	public init() {

		this.app.notFound((ctx) => serveNotFound(ctx));

		this.app.onError((ctx, error) => serveInternalServerError(error, ctx));

		const api = this.app.basePath("/api");

		api.get("/ping", (ctx) => ctx.json({ message: "pong" }));

		const userRepo = new UserRepository();

		const userService = new UserService(userRepo);

		const authController = new AuthController(userService);

		this.initAuthRoutes(api, authController);
	}

	private initAuthRoutes(api: Hono, authController: AuthController): void {
		const auth = new Hono();

		auth.get("/userinfo", authController.userinfo);
		api.post("/login", loginValidation, authController.login);
		api.post("/register", registerValidation, authController.register);

		api.route("/auth", auth);
	}
}
