import { Response } from "express-serve-static-core";
import { NextFunction } from "express";
import { Post } from "~/services/postService";
import { RequestWithToken } from "~/types/types";
import { getFiles } from "~/utils/format";

interface createPostBody {
  description: string,
}

interface getPostAllBody {
  page?: number,
  page_size?: number
}

interface getPostParams {
  postId: string
}

interface postLikeParam {
  postId: string
}

interface postLikeBody {
  like: boolean
}

async function createPost(req: any, res: Response, next: NextFunction) {
  const { description }: createPostBody = req.body
  const { _id } = req.verifiedToken

  try {
    const files = getFiles(req) as any[]

    const insertedId = await Post.create(description, _id, files)
    res.status(200).send({ insertedId: insertedId })
  } catch (e) {
    return next(e)
  }
}

async function getAllPost(req: RequestWithToken, res: Response, next: NextFunction) {
  const { page, page_size }: getPostAllBody = req.query as unknown as getPostAllBody
  const { _id } = req.verifiedToken

  try {
    const result = await Post.getAll(_id as string, page, page_size)
    res.status(200).send({ data: result })
  } catch (e) {
    return next(e)
  }
}

async function getPost(req: RequestWithToken, res: Response, next: NextFunction) {
  const { postId }: getPostParams = req.params as unknown as getPostParams
  const { _id } = req.verifiedToken

  try {
    const result = await Post.getPost(_id, postId)
    res.status(200).send(result)
  } catch (e) {
    return next(e)
  }
}


async function likePost(req: RequestWithToken, res: Response, next: NextFunction) {
  const { postId }: postLikeParam = req.params as unknown as postLikeParam
  const { like }: postLikeBody = req.body as unknown as postLikeBody

  const { _id } = req.verifiedToken

  try {
    await Post.likePost(_id, postId, like)
    res.status(200).send()
  } catch (e) {
    return next(e)
  }
}

async function deletePost(req: RequestWithToken, res: Response, next: NextFunction) {
  const { postId }: postLikeParam = req.params as unknown as postLikeParam
  const { _id } = req.verifiedToken

  try {
    await Post.deletePost(_id, postId)
    res.status(200).send()
  } catch (error) {
    return next(error)
  }
}

async function deleteAllPost(req: RequestWithToken, res: Response, next: NextFunction) {
  const { _id } = req.verifiedToken

  try {
    await Post.deleteAllPost(_id)
    res.status(200).send()
  } catch (error) {
    return next(error)
  }
}

export default {
  createPost,
  getAllPost,
  getPost,
  likePost,
  deletePost,
  deleteAllPost
}