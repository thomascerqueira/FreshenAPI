import { config } from '~/config';
import { Report } from '~/types/report';
import { User } from '~/types/user';
import { db } from '~/utils/mongo';
import { getOneUser } from './user';

function getCollection() {
  return db.collection(config.db_report);
}

export const getAllReports = async (
  filter = {},
  page = 0,
  pageSize = 20,
): Promise<{ count: number; data: Array<Report> }> => {
  const reports: Array<unknown> = await getCollection()
    .aggregate([
      { $match: filter },
      {
        $project: {
          _id: '$_id',
          type: '$type',
          status: '$status',
          reportedId: '$reportedId',
          category: '$category',
          description: '$description',
          createdAt: '$createdAt',
          user: {
            $toObjectId: '$reportedBy',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
    ])
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  const count: number = await getCollection().countDocuments(filter);
  return { count, data: <Report[]>reports };
};

export const createReport = async (
  type: string,
  status: string,
  reportedId: string,
  category: string,
  description: string,
  reportedBy: string,
): Promise<Report> => {
  const report: any = getCollection().insertOne({
    type,
    status,
    reportedId,
    category,
    description,
    createdAt: Date.now(),
    reportedBy,
  });
  const user: User = await getOneUser(reportedBy);
  (report.reportedBy = undefined), (report.user = user);
  return <Report>report;
};
