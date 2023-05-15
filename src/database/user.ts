/* istanbul ignore file */
import { User } from '~/types/user';
import { db, toObjectId } from '~/utils/mongo';
import { config } from '~/config';
import { NotFoundException } from '~/utils/exceptions';
import { FriperieUser } from '~/types/friperie';

function getCollection() {
  return db.collection(config.db_users);
}

/* istanbul ignore next */
export const getAllUsers = async (
  filter = {},
  page = 0,
  pageSize = 20,
): Promise<{ count: number; data: Array<User> }> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users: Array<any> = await getCollection()
    .find(filter)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const count: number = await getCollection().countDocuments(filter);
  return { count: count, data: users };
};

export const getOneUser = async (
  userId,
  passWithoutUser = false,
): Promise<User | FriperieUser> => {
  const _id = toObjectId(userId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = await getCollection().findOne({ _id });

  if (!user && !passWithoutUser) {
    throw new NotFoundException('User not found');
  }

  if (user.friperie) {
    return <FriperieUser>user;
  }
  return <User>user;
};
