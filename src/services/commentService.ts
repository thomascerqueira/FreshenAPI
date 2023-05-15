import {
  createOneComment,
  deleteOneComment,
  getAllComment,
  getCommentFromPost,
  getReplyComment,
  likeOneComment,
  updateOneComment,
} from '~/database/comment';

export class Comment {
  static async getAll(filter = {}, page = 0, pageSize = 0) {
    return await getAllComment(filter, page, pageSize);
  }
  static async getFromPost(id: string, page = 0, pageSize = 0) {
    return await getCommentFromPost(id, page, pageSize);
  }
  static async getReply(id: string) {
    return await getReplyComment(id);
  }
  static async create(id: string, message: string, replyId = undefined) {
    return await createOneComment(id, message, replyId);
  }
  static async updateOne(id: string, message: string) {
    return await updateOneComment(id, message);
  }
  static async deleteOne(id: string) {
    return await deleteOneComment(id);
  }
  static async likeOne(id: string, userId: string) {
    return await likeOneComment(id, userId);
  }
}
