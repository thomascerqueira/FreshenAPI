/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import { pick } from 'lodash';
import { Friperie, FriperieUser } from '~/types/friperie';
import { BadRequestException } from './exceptions';

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export class Format {
  static userPublicProfile(user: any) {
    return pick(user, [
      '_id',
      'username',
      'privacy',
      'locale',
      'creationDate',
      'description',
      'avatar',
      'discriminator',
      'follow',
      'followers',
      'block',
      "profile_picture",
      "banner",
      'friperie',
      "banned",
      "favoris",
      "email"
    ]);
  }

  static userPrivateProfile(user: any) {
    return pick(user, [
      '_id',
      'username',
      'privacy',
      'locale',
      'avatar',
      'discriminator',
      'creationDate',
      'description',
      'friperie'
    ]);
  }

  static friperiePublicInfo(friperieUser: FriperieUser, friperie: Friperie) {
    const _friperieUser = pick(friperieUser, [
      '_id',
      'email',
      'siret',
      'tel',
      'followers',
      'following',
      'friperie',
    ]);

    return Object.assign({}, _friperieUser, friperie);
  }
}

/**
 * Get files from a request
 * @param req Request
 * @param pass If no files are found throw an error if pass == false
 * @returns files if found else null
 */
export function getFiles(req: Request, pass = false): null | undefined | any[] {
  // @ts-ignore
  const files = req.files;

  if (files == null && !pass) {
    throw new BadRequestException('missing photo');
  } else if (files == null && pass) {
    return null;
  }

  return Array.isArray(Object.values(files))
    ? Object.values(files)
    : [Object.values(files)];
}
