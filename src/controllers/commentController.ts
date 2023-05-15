import { Request, Response } from 'express';
import { Comment } from '~/services/commentService';
import { RequestWithToken } from '~/types/types';

interface Filters {
  userId?: string;
  postId?: string;
  commentId?: string;
}

const getAllComment = async (req: Request, res: Response) => {
  const { page, pageSize, userId } = req.query;
  const filter: Filters = {};
  if (userId) filter.userId = <string>userId;
  const comment = await Comment.getAll(
    filter,
    parseInt(<string>page, 10),
    parseInt(<string>pageSize, 10),
  );
  res.status(200).send(comment);
};

const getFromPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page, pageSize } = req.query;
  const comment = await Comment.getFromPost(
    id,
    parseInt(<string>page, 10),
    parseInt(<string>pageSize, 10),
  );
  res.status(200).send(comment);
};

const getReplyFromComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const comment = await Comment.getReply(id);
  res.status(200).send(comment);
};

const createComment = async (req: Request, res: Response) => {
  const { id: postId, message, commentId: replyId } = req.body;
  const comment = await Comment.create(postId, message, replyId);
  res.status(201).send(comment);
};

const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body;
  const comment = await Comment.updateOne(id, message);
  res.status(200).send(comment);
};

const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Comment.deleteOne(id);
  res.status(200).send({ message: 'Successfully delete comment' });
};

const likeComment = async (req: RequestWithToken, res: Response) => {
  const { id } = req.params;
  const { _id } = req.verifiedToken;
  await Comment.likeOne(id, _id.toString());
  res.status(200).send({ message: 'Operation successfull' });
};

export default {
  getAllComment,
  createComment,
  getFromPost,
  getReplyFromComment,
  updateComment,
  deleteComment,
  likeComment,
};
