import { config } from '~/config';
import { db, toObjectId } from '~/utils/mongo';

function getCollection() {
  return db.collection(config.db_users);
}

export const blockUser = async (_id: string, id: any) => {
  return await getCollection().findOneAndUpdate(
    { _id: toObjectId(_id) },
    {
      $pull: {
        block: id,
      },
    },
  );
};

export const unblockUser = async (_id: string, id: any) => {
  return await getCollection().findOneAndUpdate(
    { _id: toObjectId(_id) },
    {
      $push: {
        block: id,
      },
    },
  );
};

export const followUser = async (_id: string, id: any) => {
  await getCollection().findOneAndUpdate(
    { _id: toObjectId(_id) },
    {
      $push: {
        follow: id,
      },
    },
  );
  return await getCollection().findOneAndUpdate(
    { _id: toObjectId(id) },
    {
      $push: {
        followers: id,
      },
    },
  );
};

export const unfollowUser = async (_id: string, id: any) => {
  await getCollection().findOneAndUpdate(
    { _id: toObjectId(_id) },
    {
      $pull: {
        follow: id,
      },
    },
  );
  return await getCollection().findOneAndUpdate(
    { _id: toObjectId(id) },
    {
      $pull: {
        followers: id,
      },
    },
  );
};
