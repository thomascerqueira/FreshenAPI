import { getCollection, toObjectId } from "~/utils/mongo";
import { config } from "~/config";
import { Friperie } from "~/types/friperie";
import { addAllPhoto, deleteBucketDirectory } from "./photos";
import { Avis } from "~/types/avis";
import { NotFoundException } from "~/utils/exceptions";
import { AvisFriperiesDoesntExist, FriperieDoesntExists } from "./Errors/friperieError";

export class Friperies {
  static async create(name: string, type: string, desc: string, position: { lat: number, lng: number }, photos?: any[]) {
    const friperie: Friperie = {
      name,
      type,
      desc,
      position,
      photos: [],
      avis: {}
    }

    const { insertedId } = await getCollection(config.friperies).insertOne(friperie)

    if (!photos) {
      return insertedId
    }

    const urlPhoto = await addAllPhoto(`friperies/${insertedId}`, photos)

    await getCollection(config.friperies).updateOne({ _id: insertedId }, {
      $set: {
        photos: urlPhoto
      }
    })
    return insertedId
  }

  static async get(id: string) {
    const friperie = await getCollection(config.friperies).findOne({
      _id: toObjectId(id)
    })

    if (!friperie) {
      throw new FriperieDoesntExists(id)
    }

    return friperie as unknown as Friperie
  }

  static async getAll(page: number = 0, pageSize: number = 20) {
    return await getCollection(config.friperies)
      .find()
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray() as unknown as Array<Friperie>
  }

  static async updatePhoto(id: string, photos: any[]) {
    await Friperies.get(id)
    const directory: string = `friperies/${id}`

    try {
      await deleteBucketDirectory(directory)
    } catch (e) {
      console.error(e)
    }

    const urlPhotos: string[] = await addAllPhoto(directory, photos);

    await getCollection(config.friperies).updateOne({
      _id: toObjectId(id)
    }, {
      $set: {
        photos: urlPhotos
      }
    })
  }

  static async update(id: string, name?: string, type?: string, desc?: string, position?: { lat: number, lng: number }) {
    const friperie: Friperie = await Friperies.get(id)

    await getCollection(config.friperies).updateOne({
      _id: toObjectId(id)
    }, {
      $set: {
        "name": name ? name : friperie.name,
        "type": type ? type : friperie.type,
        "desc": desc ? desc : friperie.desc,
        "position": position ? position : friperie.position
      }
    })
  }

  static async letAvis(idFriperie:string, id: string, avis: Avis) {
    await Friperies.get(idFriperie);

   await getCollection(config.friperies).updateOne({
      _id: toObjectId(idFriperie)
    }, {
      $set: {
        [`avis.${id}`]: avis
      }
    })
  }

  static async getAllAvis(idFriperie: string): Promise<{ [key: string]: Avis; }> {
    const friperie = await Friperies.get(idFriperie)
    
    return friperie.avis
  }

  static async getAvis(idFriperie: string, id: string): Promise<Avis> {
    const friperie = await Friperies.get(idFriperie)
    const avis = friperie.avis[id]

    if (!avis) {
      throw new AvisFriperiesDoesntExist(idFriperie, id)
    }

    return avis
  }

  static async deleteAvis(idFriperie: string, id: string) {
    await Friperies.getAvis(idFriperie, id)

    await getCollection(config.friperies).updateOne({
      _id: toObjectId(idFriperie)
    }, {
      $unset: {
        [`avis.${id}`]: ""
      }
    })
  }
}