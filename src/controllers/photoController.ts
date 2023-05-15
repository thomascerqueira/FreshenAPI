import {Response} from "express-serve-static-core";
import {NextFunction} from "express";
import {addPhotoFromByteArray} from "~/services/photos";

async function receive_photo(req: any, res: Response, next: NextFunction) {
  const photos = Array.isArray(req.files.Photos) ? req.files.Photos : [req.files.Photos]

  try {
    for (const i in photos) {
      const photo = photos[i]
      await addPhotoFromByteArray("test", photo.name, new Uint8Array(photo.data))
    }
    res.status(200).send()
  } catch (e) {
    return next(e)
  }
}

export default {
  receive_photo
}