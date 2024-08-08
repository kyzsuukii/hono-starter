import { encrypt } from "../../lib/crypto";
import type { UpdateUser } from "../../lib/types";
import type { UserRepository } from "../repository/user";
import { v4 as uuidv4 } from "uuid";
export class UserService {
	private repo: UserRepository;

	constructor(userRepository: UserRepository) {
		this.repo = userRepository;

		this.create = this.create.bind(this);
		this.findByEmail = this.findByEmail.bind(this);
	}

	public async create(name: string, email: string, password: string) {
		const hashedPassword = encrypt(password);
		await this.repo.create({
			id: uuidv4(),
			name,
			email,
			password: hashedPassword,
		});
	}

	public async findByEmail(email: string) {
		return this.repo.findByEmail(email);
	}

	public async find(id: string) {
		return this.repo.find(id);
	}

	public async updateByEmail(email: string, user: Partial<UpdateUser>) {
		if (user.password) {
			user.password = encrypt(user.password);
		}

		return this.repo.updateByEmail(email, user);
	}
}
