import { Users } from "~/services/userService";
import { User } from "~/types/user";
import { ForbiddenException, NotFoundException } from "./exceptions";

/**
 * Try to get a user in the DB, if the user doesn't exists or is banned throw an error
 * @param uid Uid of the user
 * @returns user
 */
export async function getUser(uid: string): Promise<User> {
    const user: User = await Users.getOne(uid) as User;

    /* istanbul ignore if */
    if (!user) {
        throw new NotFoundException("User not found")
      }
    /* istanbul ignore if */
    
    if (user.banned) {
        throw new ForbiddenException('You are blocked from the services');
    }
    return user
}