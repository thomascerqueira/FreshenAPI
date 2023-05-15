import { Document } from 'mongodb';
import { getAllUsers, getOneUser } from '~/database/user';
import { FriperieUser } from '~/types/friperie';
import { Format } from '~/utils/format';
import { getUser } from '~/utils/user';
import { config } from '../config';
import { User } from '../types/user';
import { NotFoundException } from '../utils/exceptions';
import { getCollection, toObjectId } from '../utils/mongo';
import { Friperies } from './friperiesService';
import { addPhotoAndGetUrl } from './photos';

export class Users {
  /**
   * Get all user
   * @param filter filter the request
   * @param page page number where to start getting data
   * @param pageSize number of user per page
   */
  static async getAll(filter = {}, page = 0, pageSize = 0) {
    return await getAllUsers(filter, page, pageSize);
  }

  /**
   * Get one user
   * @param userId user Id
   */
  static async getOne(userId: string): Promise<User | FriperieUser> {
    return await getOneUser(userId);
  }

  static async searchUserInDbByUsername(username: string) {
    const users: Array<User> = (await getCollection(config.db_users)
      .find({
        username: {
          $regex: username,
          $options: 'i',
        },
      })
      .limit(20)
      .toArray()) as unknown as Array<User>;

    return users.map((user: User) => {
      return Format.userPublicProfile(user);
    });
  }

  /**
   * Update a value of a user
   * @param uid uid of the user
   * @param value value to update
   */
  static async updateOne(uid: string, value: Record<string, unknown>) {
    const _id = toObjectId(uid);

    return getCollection(config.db_users).updateOne(
      { _id },
      {
        $set: value,
      },
    );
  }

  /**
   * Push a value in an array of a user
   * @param uid uid of the user
   * @param value value to update
   */
  static async pushOne(uid: string, value: Record<string, unknown>) {
    const _id = toObjectId(uid);

    return getCollection(config.db_users).updateOne(
      { _id },
      {
        $push: value,
      },
    );
  }

  /**
   * Remove a value in an array of a user
   * @param uid uid of the user
   * @param value value to update
   */
  static async removeOne(uid: string, value: Record<string, unknown>) {
    const _id = toObjectId(uid);

    return getCollection(config.db_users).updateOne(
      { _id },
      {
        $pull: value,
      },
    );
  }

  /**
   * Delete a user
   * /!\ doesn't delete the post, use deleteAllPost
   * @param uid uid of the user
   */
  static async delete(uid: string) {
    const user = await getOneUser(uid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await getCollection(config.db_users_deleted).insertOne(user as Document);
    return await getCollection(config.db_users).deleteOne(user);
  }

  /**
   * Block a user from the service
   * @param uid uid of the user
   * @param block block or not
   * @param reason reason of the block
   */
  static async blockUser(uid: string, block: boolean, reason?: string) {
    const user: User = (await getOneUser(uid)) as User;

    await Users.updateOne(uid, {
      banned: block,
    });
    const isBlock = block ? 'blocked' : 'unblocked';
    /* istanbul ignore next */
    return `User ${user.username} as been ${isBlock}${
      reason ? ` because ${reason}` : ''
    }`;
  }

  static async changeUsername(uid: string, newName: string) {
    await getOneUser(uid);

    await Users.updateOne(uid, {
      username: newName,
    });
  }

  static async changeDescription(uid: string, newDesc: string) {
    await getOneUser(uid);

    await Users.updateOne(uid, {
      description: newDesc,
    });
  }

  static async addFavoris(uid: string, friperieId: string) {
    await getOneUser(uid);
    await Friperies.get(friperieId);

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(uid) },
      {
        $addToSet: {
          favoris: friperieId,
        },
      },
    );
  }

  static async getFavoris(uid: string) {
    const user: User = (await getOneUser(uid)) as User;

    return user.favoris;
  }

  static async deleteFavoris(uid: string, friperieId: string) {
    await getOneUser(uid);
    await Friperies.get(friperieId);

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(uid) },
      {
        $pull: {
          favoris: friperieId,
        },
      },
    );
  }

  static async changeProfilePicture(uid: string, photo: any) {
    const name = 'profile_picture.' + photo.name.split('.').pop();

    const urlPhoto = await addPhotoAndGetUrl(
      `users/${uid}`,
      name,
      new Uint8Array(photo.data),
    );

    await Users.updateOne(uid, {
      profile_picture: urlPhoto,
    });
  }

  static async changeBannerPicture(uid: string, photo: any) {
    const name = 'banner.' + photo.name.split('.').pop();

    const urlPhoto = await addPhotoAndGetUrl(
      `users/${uid}`,
      name,
      new Uint8Array(photo.data),
    );

    await Users.updateOne(uid, {
      banner: urlPhoto,
    });
  }

  static async blockOtherUser(uid: string, otherUid: string) {
    await getUser(uid);

    await this.pushOne(uid, { userBlocked: otherUid });
  }

  static async unblockOtherUser(uid: string, otherUid: string) {
    await getUser(uid);

    await this.removeOne(uid, { userBlocked: otherUid });
  }

  static async followUser(uid: string, followUid: string) {
    const user: User = (await getOneUser(uid)) as User;

    const userToFollow: User = (await getOneUser(followUid)) as User;

    if (
      user.follow.includes(followUid) ||
      userToFollow.followers.includes(uid)
    ) {
      return;
    }

    //TODO check if user is blocked by the user if its the case throw new error

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(uid) },
      {
        $push: {
          following: followUid,
        },
      },
    );

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(followUid) },
      {
        $push: {
          followers: uid,
        },
      },
    );
  }

  static async unfollowUser(uid: string, followUid: string) {
    const user: User = (await getOneUser(uid)) as User;

    const userToFollow: User = (await getOneUser(followUid)) as User;

    if (
      user.follow.includes(followUid) ||
      userToFollow.followers.includes(uid)
    ) {
      return;
    }

    //TODO check if user is blocked by the user if its the case throw new error

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(uid) },
      {
        $pull: {
          following: followUid,
        },
      },
    );

    await getCollection(config.db_users).updateOne(
      { _id: toObjectId(followUid) },
      {
        $pull: {
          followers: uid,
        },
      },
    );
  }

  static async getFollow(uid: string): Promise<{
    follower: string[];
    follow: string[];
  }> {
    const user: User = (await getOneUser(uid)) as User;

    return {
      follower: user.followers,
      follow: user.follow,
    };
  }
}
