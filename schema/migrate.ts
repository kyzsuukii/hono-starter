import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection, db } from "../src/lib/db";

await migrate(db, {
	migrationsFolder: "./schema/migration",
});

await createConnection.end();
