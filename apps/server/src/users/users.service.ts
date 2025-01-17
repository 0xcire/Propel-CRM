import { deleteUserByID, findUsersByEmail, findUsersByID, findUsersByUsername, updateUserByID, User } from "@propel/drizzle";
import { IUsersService } from "./users.interface";
import { PropelHTTPError } from "../lib/http-error";
import { checkPassword, hashPassword } from "@propel/lib";
import { SALT_ROUNDS } from "../common/config";
import { deleteRedisKV } from "@propel/redis";
import { Ctx } from "../types";
import { removeAuthSessionCookies } from "../common/utils";

export class UsersService implements IUsersService{
    async getCurrentUserInfo(userId: number): Promise<Partial<User> | undefined> {
        return await findUsersByID({
            id: userId,
            requestingInfo: true,
        });
    }

    async updateUser(userId: number, { email, username, password, verifyPassword}: { username?: string; email?: string; verifyPassword?: string; password?: string; }): Promise<{ id: number; username: string; email: string; } | undefined> {
        let hashedPassword;
        
        if (!verifyPassword) {
          throw new PropelHTTPError({
            code: "UNAUTHORIZED",
            message: "Verify password to confirm changes",
          });
        }

        const currentUser = await findUsersByID({ id: userId, updating: true });

        if (password) {
          hashedPassword = await hashPassword(password, +(SALT_ROUNDS as string));

          const passwordMatches = await checkPassword(password, currentUser?.hashedPassword as string);

          if (passwordMatches) {
            throw new PropelHTTPError({
              code: "CONFLICT",
              message: "Password can't match previous one.",
            });
          }
        }

        const passwordVerified = await checkPassword(verifyPassword, currentUser?.hashedPassword as string);

        if (!passwordVerified) {
          throw new PropelHTTPError({
            code: "CONFLICT",
            message: "Enter your password correctly to confirm changes.",
          });
        }

        if (username) {
          const userByUsername = await findUsersByUsername(username);

          if (userByUsername) {
            throw new PropelHTTPError({
              code: "CONFLICT",
              message: "Username is taken. Please pick another.",
            });
          }
        }

        if (email) {
          const userByEmail = await findUsersByEmail({ email: email });

          if (userByEmail) {
            throw new PropelHTTPError({
              code: "CONFLICT",
              message: "Email is already taken. Please pick another.",
            });
          }
        }

        return await updateUserByID({
          id: userId,
          newUsername: username,
          newEmail: email,
          newPassword: hashedPassword,
        });
    }

    async deleteUser(userId: number, sessionId: string, { req, res }: Ctx): Promise<{ name: string; username: string; } | undefined> {
        const results = await Promise.all([deleteRedisKV(sessionId), deleteUserByID(userId)])
        removeAuthSessionCookies(req, res);
        
        return results[1]
    }
}