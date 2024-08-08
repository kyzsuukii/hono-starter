import { eq } from "drizzle-orm";
import { userSchema } from "../../../schema";
import { db, type NewUser } from "../../lib/db";
import type { UpdateUser } from "../../lib/types";

export class UserRepository {
	public async create(user: NewUser) {
		return db.insert(userSchema).values(user);
	}

	public async find(id: string) {
		return db.query.userSchema.findFirst({
			where: eq(userSchema.id, id),
		});
	}

	public async findByEmail(email: string) {
		return db.query.userSchema.findFirst({
			where: eq(userSchema.email, email),
		});
	}

	public async updateByEmail(email: string, user: Partial<UpdateUser>) {
		return db.update(userSchema).set(user).where(eq(userSchema.email, email));
	}
}
