import {
	randomBytes,
	createHash,
	createCipheriv,
	createDecipheriv,
} from "node:crypto";
import { env } from "./env";

const encrypt = (text: string): string => {
	const iv = randomBytes(16);

	const key = createHash("sha256")
		.update(env.SECRET_KEY)
		.digest("base64")
		.slice(0, 32);

	const cipher = createCipheriv("aes-256-cbc", key, iv);

	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");

	return `${iv.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText: string): string => {
	const [ivHex, ciphertext] = encryptedText.split(":");

	const iv = Buffer.from(ivHex, "hex");

	const key = createHash("sha256")
		.update(env.SECRET_KEY)
		.digest("base64")
		.slice(0, 32);

	const decipher = createDecipheriv("aes-256-cbc", key, iv);

	let decrypted = decipher.update(ciphertext, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
};

const verify = (text: string, encryptedText: string): boolean => {
	return text === decrypt(encryptedText);
};

export { encrypt, verify };
