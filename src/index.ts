import { Hono } from "hono";
import { jwt, type JwtVariables } from "hono/jwt";
import { serve } from "@hono/node-server";
import { showRoutes } from "hono/dev";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { logger as httpLogger } from "hono/logger";
import { trimTrailingSlash } from "hono/trailing-slash";
import { createConnection } from "./lib/db";
import { logger } from "./lib/logger";
import { env } from "./lib/env";
import { Routes } from "./web/routes";
import { NODE_ENVIRONMENTS } from "./lib/constants";

const app = new Hono();

app.use("/api/auth/*", (ctx, next) => {
	const jwtMiddleware = jwt({
		secret: env.SECRET_KEY,
	});
	return jwtMiddleware(ctx, next);
});

app.use(cors());
app.use(compress());
app.use(httpLogger());
app.use(trimTrailingSlash());

await createConnection.ping();
logger.info("Database connection established");

const routes = new Routes(app);

routes.init();

if (env.NODE_ENV === NODE_ENVIRONMENTS.development) {
	console.log("Available routes:");
	showRoutes(app);
}

const port = Number.parseInt(env.PORT);
const server = serve({
	fetch: app.fetch,
	port,
});

logger.info(`Server listening on port ${port}, environment: ${env.NODE_ENV}`);

process.on("SIGTERM", () => {
	logger.info("SIGTERM received, closing http server");

	server.close(async () => {
		logger.info("HTTP server closed, closing database connection");

		await createConnection.end();

		logger.info("Database connection closed, exiting process");
		process.exit(0);
	});
});
