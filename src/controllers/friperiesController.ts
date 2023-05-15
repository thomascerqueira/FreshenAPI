import {Request, Response} from "express-serve-static-core";
import {NextFunction} from "express";
import {Friperies} from "~/services/friperiesService";
import { getFiles } from "~/utils/format";
import { RequestWithToken } from "~/types/types";
import { Avis } from "~/types/avis";

interface CreateFriperie {
  name: string,
  type: string,
  position: {
    lat: number,
    lng: number
  },
  description: string
}

interface UpdateFriperie {
  name?: string,
  type?: string,
  position?: {
    lat: number,
    lng: number
  },
  description?: string
}

interface GetFriperie {
  friperieId: string
}

interface GetAllFriperies {
  page: number,
  page_size: number
}

interface PostAvis {
  note: number,
  comment: string
}

interface AvisParams {
  id: string
}

interface GetAvisParams {
  id: string,
  userId: string
}

async function createFriperie(req: Request, res: Response, next: NextFunction) {
  const {name, type, position, description}: CreateFriperie = req.body

  try {
    const files = getFiles(req, true) as any[] | undefined
    const insertedId = await Friperies.create(name, type, description, position, files)
    res.status(200).send({insertedId: insertedId})
  } catch (e) {
    return next(e)
  }
}

async function getFriperie(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const {friperieId}: GetFriperie = req.params

  try {
    const friperie = await Friperies.get(friperieId)
    res.status(200).send(friperie)
  } catch (e) {
    return next(e)
  }
}

async function getAllFriperie(req: Request, res: Response, next: NextFunction) {
  const {page, page_size}: GetAllFriperies = req.query as unknown as GetAllFriperies

  try {
    const friperie = await Friperies.getAll(page, page_size)
    res.status(200).send(friperie)
  } catch (e) {
    return next(e)
  }
}

async function updatePhotoFriperie(req: RequestWithToken, res: Response, next: NextFunction) {
  const { _id } = req.verifiedToken
  
  try {
    const files = getFiles(req) as any[]
    await Friperies.updatePhoto(_id, files)
    res.status(200).send()
  } catch (error) {
    return next(error)
  }
}

async function letAvis(req: RequestWithToken, res: Response, next: NextFunction) {
  const { _id } = req.verifiedToken
  const { id } = req.params as unknown as AvisParams
  const {note, comment} : PostAvis = req.body as PostAvis

  try {
    const avis: Avis = {
      note,
      comment,
      id
    }
    await Friperies.letAvis(id, _id, avis)
    res.status(200).send();
  } catch (error) {
    return next(error)
  }
}

async function getAllAvis(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params as unknown as AvisParams

  try {
    const avis = await Friperies.getAllAvis(id)
    res.status(200).send(avis);
  } catch (error) {
    return next(error)
  }
}

async function getAvis(req: Request, res: Response, next: NextFunction) {
  const { id, userId }: GetAvisParams = req.params as unknown as GetAvisParams

  try {
    const avis = await Friperies.getAvis(id, userId)
    res.status(200).send(avis);
  } catch (error) {
    return next(error)
  }
}

async function deleteAvis(req: RequestWithToken, res: Response, next: NextFunction) {
  const { _id } = req.verifiedToken
  const { id } = req.params as unknown as AvisParams

  try {
    await Friperies.deleteAvis(id, _id)
    res.status(200).send();
  } catch (error) {
    return next(error)
  }
}

async function updateFriperie(req: RequestWithToken, res: Response, next: NextFunction) {
  const { _id } = req.verifiedToken
  const {name, type, position, description}: UpdateFriperie = req.body as UpdateFriperie;

  try {
    await Friperies.update(_id, name, type, description, position)
    res.status(200).send()
  } catch (e) {
    return next(e)
  }
}

async function updateFriperieAdmin(req: RequestWithToken, res: Response, next: NextFunction) {
  const { id } : {id: string} = req.params as unknown as {id: string}
  const {name, type, position, description}: UpdateFriperie = req.body as UpdateFriperie;

  try {
    await Friperies.update(id, name, type, description, position)
    res.status(200).send()
  } catch (e) {
    return next(e)
  }
}

export default {
  createFriperie,
  getFriperie,
  getAllFriperie,
  updatePhotoFriperie,
  letAvis,
  getAllAvis,
  getAvis,
  deleteAvis,
  updateFriperie,
  updateFriperieAdmin
}