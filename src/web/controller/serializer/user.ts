import type { User } from "../../../lib/db";

type UserResponse = {
    id: number;
    name: string;
    email: string;
    createdAt: Date | null;
};

const serializeUser = (user: User): UserResponse => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    };
};

export { serializeUser };