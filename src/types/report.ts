import { User } from './user';

export interface Report {
  _id: string;
  type: string;
  status: string;
  reportedId: string;
  category: string;
  description: string;
  createdAt: string;
  user: User;
}
