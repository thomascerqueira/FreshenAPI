import { Request, Response } from 'express';
import { Report } from '~/services/reportService';
import { RequestWithToken } from '~/types/types';

interface Filters {
  userId?: string;
  postId?: string;
  commentId?: string;
}

const getAllReport = async (req: Request, res: Response) => {
  const { page, pageSize, userId, postId, commentId } = req.query;
  const filter: Filters = {};
  if (userId) filter.userId = <string>userId;
  if (postId) filter.postId = <string>postId;
  if (commentId) filter.commentId = <string>commentId;
  const report = await Report.getAll(
    filter,
    parseInt(<string>page, 10),
    parseInt(<string>pageSize, 10),
  );
  res.status(200).send(report);
};

const createReport = async (req: RequestWithToken, res: Response) => {
  const { type, reportedId, category, description } = req.body;
  const { _id } = req.verifiedToken;
  const report = await Report.create(
    type,
    reportedId,
    category,
    _id,
    description,
  );
  res.status(200).send(report);
};

export default {
  getAllReport,
  createReport,
};
