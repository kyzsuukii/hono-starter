import type { Hono } from "hono";
import { serveInternalServerError, serveNotFound } from "./res/error";

export class Routes {
	private app: Hono;

	constructor(app: Hono) {
		this.app = app;
	}

	public init() {
		this.app.get("/", (ctx) => ctx.text("Hello, World!"));

		this.app.notFound((ctx) => serveNotFound(ctx));

		this.app.onError((ctx, error) => serveInternalServerError(error, ctx));

		const api = this.app.basePath("/api");

		api.get("/ping", (ctx) => ctx.text("pong"));
	}
}
