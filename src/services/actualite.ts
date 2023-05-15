import { getOneUser } from '~/database/user';
import { User } from '~/types/user';
import { Post } from './postService';

export class Actualite {
  static async getActualiteFriperie(
    id: string,
    page?: number,
    pageSize?: number,
  ) {
    const user = (await getOneUser(id)) as User;

    const Posts: Post[] = await Post.getAllFromMultipleUid(
      user.favoris,
      page,
      pageSize,
    );

    return Posts;
  }

  //   static async getActualiteUser(id: string, page?: number, pageSize?: number) {
  //     const user = (await getOneUser(id)) as User;
  //     let Posts: Post[];

  //     if (user.follow.length == 0) {
  //       Posts = await Post.getFromMostLiked(page, pageSize);
  //     } else {
  //       Posts = await Post.getAllFromMultipleUid(user.follow, page, pageSize);
  //     }

  //     return Posts;
  //   }
}
