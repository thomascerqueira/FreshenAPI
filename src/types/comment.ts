export interface Comment {
  _id: string;
  postId: string;
  message: string;
  createdAt: Date;
  updated: boolean;
  reply: Array<string>;
  like: Array<string>;
  root: boolean;
}
