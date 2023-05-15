export interface Post {
  _id: any,
  likes: number,
  liked: string[],
  description: string,
  author: {
    id: string,
    surname: string,
    name: string,
    pics: string
  },
  created_at: Date,
  photos: string[]
}
