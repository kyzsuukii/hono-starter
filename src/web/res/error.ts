import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

const serveNotFound = (c: Context) => {
	return c.json(
		{ error: getReasonPhrase(StatusCodes.NOT_FOUND) },
		<StatusCode>StatusCodes.NOT_FOUND,
	);
};

const serveBadRequest = (c: Context, message: string) => {
	return c.json({ error: message }, <StatusCode>StatusCodes.BAD_REQUEST);
};

const serveUnprocessableEntity = (c: Context, message: string) => {
	return c.json(
		{ error: message },
		<StatusCode>StatusCodes.UNPROCESSABLE_ENTITY,
	);
};

const serveUnauthorized = (c: Context) => {
	return c.json(
		{ error: getReasonPhrase(StatusCodes.UNAUTHORIZED) },
		<StatusCode>StatusCodes.UNAUTHORIZED,
	);
};

const serveInternalServerError = (c: Context, error: Error) => {
	if (error instanceof HTTPException) {
		return c.json({ error: error.message }, <StatusCode>error.status);
	}

	return c.json(
		{ error: error },
		<StatusCode>StatusCodes.INTERNAL_SERVER_ERROR,
	);
};

const serveError = (c: Context, status: StatusCodes, message: string) => {
	return c.json({ error: message }, <StatusCode>status);
};

export {
    serveNotFound,
    serveBadRequest,
    serveUnprocessableEntity,
    serveUnauthorized,
    serveInternalServerError,
    serveError,
};