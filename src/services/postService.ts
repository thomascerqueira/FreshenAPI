import { config } from '~/config';
import { User } from '~/types/user';
import { ForbiddenException, NotFoundException } from '~/utils/exceptions';
import { getCollection, toObjectId } from '~/utils/mongo';
import { Post as interPost } from '../types/post';
import { addAllPhoto, getAllUrlForDirectory } from './photos';
import { Users } from './userService';

export class Post {
  /***
   * Create a post
   * @param description description for the post
   * @param uid uid of the user
   */
  static async create(description: string, uid: string, photos: any[]) {
    const user: User = (await Users.getOne(uid)) as User;

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.banned) {
      throw new ForbiddenException('You are blocked from the services');
    }

    const post = {
      description: description,
      created_at: new Date(),
      photos: [],
      likes: 0,
      liked:[],
      author: {
        id: user._id,
        surname: user.username,
        name: "Pour l'instant y'en a pas",
        pic: 'https://bit.ly/3wcda2f',
      },
    };
    const { insertedId } = await getCollection(config.db_post).insertOne(post);
    const urlsPhoto: string[] = await addAllPhoto(
      `posts/${uid}/${insertedId.toString()}`,
      photos,
    );

    await getCollection(config.db_post).updateOne(
      {
        _id: insertedId,
      },
      {
        $set: {
          photos: urlsPhoto,
        },
      },
    );

    return insertedId;
  }

  /**
   * Get all post for a user
   * @param uid uid of the user
   * @param page page number where to start
   * @param pageSize number of document per page
   */
  static async getAll(uid: string, page = 0, pageSize = 20) {
    const user: User = (await Users.getOne(uid)) as User;
    const _id = toObjectId(uid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const posts = (await getCollection(config.db_post)
      .find({
        'author.id': _id,
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()) as Array<interPost>;

    return posts;
  }

  /**
   * Get all post for multiple uid
   * @param uid uids to get
   * @param page page number where to start
   * @param pageSize number of document per page
   */
  static async getAllFromMultipleUid(uid: string[], page = 0, pageSize = 20) {
    const posts = (await getCollection(config.db_post)
      .find({
        'author.id': {
          $in: uid.map((id) => toObjectId(id)),
        },
      })
      .sort({
        created_at: 'desc',
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()) as Array<interPost>;

    return posts;
  }

  // static async getFromMostLiked(page = 0, pageSize = 20) {
  //   const posts = await getCollection(config.db_post)
  //     .find({})
  //     .sort({
  //       likes: "desc"
  //     })
  //     .skip(page * pageSize)
  //     .limit(pageSize)
  //     .toArray() as Array<interPost>

  //   for (const [_, post] of posts.entries()) {
  //     post.photos = await getAllUrlForDirectory(`post/${uid}/${post._id!.toString()}`)
  //   }
  //   return posts
  // }

  /**
   * Get the post for the user
   * @param uid uid of the user
   * @param postId post id
   */
  static async getPost(uid: string, postId: string) {
    const user: User = (await Users.getOne(uid)) as User;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post: interPost = (await getCollection(config.db_post).findOne({
      _id: toObjectId(postId),
    })) as interPost;

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.photos = await getAllUrlForDirectory(
      `post/${uid}/${post._id!.toString()}`,
    );
    return post;
  }

  /**
   * Delete a post from the db
   * @param uid uid of the user
   * @param idPost id of the post
   */
  static async deletePost(uid: string, idPost: string) {
    const _idPost = toObjectId(idPost);
    const _uid = toObjectId(uid);
    const post = await getCollection(config.db_post).findOne({
      _id: _idPost,
      'author.id': _uid,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await getCollection(config.db_post_deleted).insertOne(post);
    await getCollection(config.db_post).deleteOne({
      _id: _idPost,
      'author.id': _uid,
    });
  }

  /**
   * Delete all post for a user (put in the db_post_deleted collection)
   * @param uid uid of the user
   */
  static async deleteAllPost(uid: string) {
    const bulkRemove = getCollection(
      config.db_post,
    ).initializeUnorderedBulkOp();
    const bulkInsert = getCollection(
      config.db_post_deleted,
    ).initializeUnorderedBulkOp();

    const docs = await getCollection(config.db_post)
      .find({
        'author.id': toObjectId(uid),
      })
      .toArray();

    if (docs.length <= 0) {
      return;
    }

    docs.forEach((doc) => {
      bulkInsert.insert(doc);
      bulkRemove
        .find({
          _id: doc._id,
        })
        .deleteOne();
    });

    await bulkInsert.execute();
    return await bulkRemove.execute();
  }

  /**
   * Like or not a post
   * @param uid uid of the user
   * @param post_id id of the post
   * @param like like or not
   */
  static async likePost(uid: string, post_id: string, like: boolean) {
    const _id = toObjectId(post_id);

    if (like) {
      await getCollection(config.db_post).updateOne(
        { _id },
        {
          $inc: {
            likes: 1,
          },
          $push: {
            liked: uid,
          },
        },
      );
    } else {
      await getCollection(config.db_post).updateOne(
        { _id },
        {
          $inc: {
            likes: -1,
          },
          $pull: {
            liked: uid,
          },
        },
      );
    }
  }
}
