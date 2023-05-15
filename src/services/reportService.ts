import { createReport, getAllReports } from '~/database/report';

export class Report {
  static async getAll(filter = {}, page = 0, pageSize = 0) {
    return await getAllReports(filter, page, pageSize);
  }

  static async create(
    type,
    reportedId,
    category,
    reportedBy: string,
    description = '',
  ) {
    return await createReport(
      type,
      'opened',
      reportedId,
      category,
      description,
      reportedBy,
    );
  }
}
