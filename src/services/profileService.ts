import {
  blockUser,
  followUser,
  unblockUser,
  unfollowUser,
} from '~/database/profile';
import { getOneUser } from '~/database/user';
import { User } from '~/types/user';

export class Profile {
  static async blockUser(_id: string, id: string) {
    const user: User = (await getOneUser(_id)) as User;

    if (user.block.includes(id)) return await blockUser(_id, id);
    else return await unblockUser(_id, id);
  }

  static async followUser(_id: string, id: string) {
    const requestedUser: User = (await getOneUser(id)) as User;
    const user: User = (await getOneUser(_id)) as User;

    if (requestedUser.block.includes(_id)) return null;
    if (user.follow.includes(id)) return await unfollowUser(_id, id);
    else return await followUser(_id, id);
  }
}
