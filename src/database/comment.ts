import { config } from '~/config';
import { Comment } from '~/types/comment';
import { db, toObjectId } from '~/utils/mongo';

function getCollection() {
  return db.collection(config.db_comment);
}

export const getAllComment = async (
  filter = {},
  page = 0,
  pageSize = 20,
): Promise<{ count: number; data: Array<unknown> }> => {
  const comments: Array<unknown> = await getCollection()
    .aggregate([
      { $match: filter },
      {
        $addFields: {
          reply: {
            $map: {
              input: '$reply',
              in: {
                $toObjectId: '$$this',
              },
            },
          },
        },
      },
      {
        $match: {
          root: true,
        },
      },
      {
        $graphLookup: {
          from: 'comment',
          startWith: '$reply',
          connectFromField: 'reply',
          connectToField: '_id',
          as: 'reply',
        },
      },
    ])
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const count: number = await getCollection().countDocuments(filter);
  return { count, data: comments };
};
export const getCommentFromPost = async (id, page = 0, pageSize = 20) => {
  const comment = await getCollection()
    .aggregate([
      {
        $match: {
          postId: id,
        },
      },
      {
        $addFields: {
          reply: {
            $map: {
              input: '$reply',
              in: {
                $toObjectId: '$$this',
              },
            },
          },
        },
      },
      {
        $graphLookup: {
          from: 'comment',
          startWith: '$reply',
          connectFromField: 'reply',
          connectToField: '_id',
          as: 'reply',
        },
      },
    ])
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const count: number = await getCollection().countDocuments({
    postId: id,
  });
  return { count, data: comment };
};

export const getReplyComment = async (id) => {
  const comment = await getCollection()
    .aggregate([
      {
        $match: {
          _id: toObjectId(id),
        },
      },
      {
        $addFields: {
          reply: {
            $map: {
              input: '$reply',
              in: {
                $toObjectId: '$$this',
              },
            },
          },
        },
      },
      {
        $graphLookup: {
          from: 'comment',
          startWith: '$reply',
          connectFromField: 'reply',
          connectToField: '_id',
          as: 'reply',
        },
      },
    ])
    .toArray();
  return { count: 1, data: comment };
};

export const createOneComment = async (id, message, replyId = undefined) => {
  const comment = await getCollection().insertOne({
    postId: id,
    message,
    createdAt: Date.now(),
    updated: false,
    reply: [],
    root: replyId === undefined ? true : false,
    like: [],
  });
  const insertedId: any = comment.insertedId.toString();
  if (replyId !== undefined) {
    getCollection().findOneAndUpdate(
      { _id: toObjectId(replyId) },
      {
        $push: {
          reply: insertedId,
        },
      },
    );
  }
  return comment;
};

export const updateOneComment = async (id, message) => {
  return await getCollection().findOneAndUpdate(
    { _id: toObjectId(id) },
    {
      $set: {
        message,
        updated: true,
      },
    },
  );
};

export const deleteOneComment = async (id) => {
  return getCollection().findOneAndDelete({ _id: toObjectId(id) });
};

export const likeOneComment = async (id: string, userId: any) => {
  const comment: Comment = (await getCollection().findOne({
    _id: toObjectId(id),
  })) as unknown as Comment;
  if (comment.like.includes(userId))
    return await getCollection().findOneAndUpdate(
      { _id: toObjectId(id) },
      {
        $pull: {
          like: userId,
        },
      },
    );
  else
    return await getCollection().findOneAndUpdate(
      { _id: toObjectId(id) },
      {
        $push: {
          like: userId,
        },
      },
    );
};
