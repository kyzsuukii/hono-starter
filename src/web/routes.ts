import { Hono } from "hono";
import {
	serveInternalServerError,
	serveNotFound,
} from "./controller/resp/error";
import { UserRepository } from "./repository/user";
import { UserService } from "./services/user";
import { AuthController } from "./controller/auth";
import {
	loginValidation,
	registerValidation,
	updateProfileValidation,
} from "./validator/user";
import { ProfileController } from "./controller/profile";

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

		const profileController = new ProfileController(userService);

		this.initProfileRoutes(api, profileController);
	}

	private initAuthRoutes(api: Hono, authController: AuthController): void {
		const auth = new Hono();

		auth.get("/userinfo", authController.userinfo);
		api.post("/login", loginValidation, authController.login);
		api.post("/register", registerValidation, authController.register);

		api.route("/auth", auth);
	}

	private initProfileRoutes(
		api: Hono,
		profileController: ProfileController,
	): void {
		const profile = new Hono();

		profile.put(
			"/userinfo/update",
			updateProfileValidation,
			profileController.update,
		);

		api.route("/auth", profile);
	}
}
