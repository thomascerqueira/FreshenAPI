/* istanbul ignore file */
import {
  FirebaseStorage,
  StorageReference,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { config } from '~/config';

/**
 * Deprecated
 * @param listPhoto
 * @param uid
 * @param folder
 */
export async function addPhoto(
  listPhoto: string[],
  uid: string,
  folder: string,
) {
  const refBucket = ref(config.storage, `${uid}/${folder}`);

  //TODO this need to add the file sent
  const ghostFile = ref(refBucket, '.ghostfile');
  await uploadString(ghostFile, '');
}

export async function addPhotoFromByteArray(
  folder: string,
  name: string,
  byteArray: Uint8Array,
) {
  const refBucket = ref(config.storage, `${folder}/${name}`);
  const extension = name.split('.').pop();

  await uploadBytes(refBucket, byteArray, {
    contentType: `image/${extension}`,
  });
}

export async function deleteBucketDirectory(folder: string) {
  const refBucket = ref(config.storage, folder);
  const allRef = await listAll(refBucket);

  await deleteObject(allRef.items[0]);
}

export async function getUrlPhoto(
  path: string,
  directory: StorageReference | FirebaseStorage,
) {
  const refBucket = ref(directory, path);

  return await getDownloadURL(refBucket);
}

export async function getAllUrlForDirectory(directory: string) {
  const listRef = ref(config.storage, directory);
  const allRef = await listAll(listRef);

  return await Promise.all(
    allRef.items.map(async (item) => await getDownloadURL(item)),
  );
}

export async function addAllPhoto(directory: string, photos: any[]) {
  for (const i in photos) {
    const photo = photos[i];
    await addPhotoFromByteArray(
      directory,
      photo.name,
      new Uint8Array(photo.data),
    );
  }

  return await getAllUrlForDirectory(directory);
}

export async function addPhotoAndGetUrl(folder: string, name: string, photo: any) {
  const path = `${folder}/${name}`

  await addPhotoFromByteArray(folder, name, new Uint8Array(photo));

  return getUrlPhoto(path, config.storage)
}
