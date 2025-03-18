import { User } from "@propel/drizzle";
import { Ctx } from "../types";

export interface IUsersService {
    getCurrentUserInfo(userId: number): Promise<Partial<User> | undefined>
    updateUser(userId: number, updateUserDto: { username?: string, email?: string, verifyPassword?: string, password?: string }): Promise<{
        id: number;
        username: string;
        email: string;
    } | undefined>
    deleteUser(userId: number, sessionId: string, ctx: Ctx): Promise<{name: string; username: string; } | undefined>
}