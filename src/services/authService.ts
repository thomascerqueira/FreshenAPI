import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { DBRef } from 'mongodb';
import { config } from '~/config';
import { Friperie, FriperieUser } from '~/types/friperie';
import { User } from '~/types/user';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '~/utils/exceptions';
import { Format } from '~/utils/format';
import { getCollection } from '~/utils/mongo';
import { Token } from '~/utils/token';
import { getUser } from '~/utils/user';
import { RefreshTokenMissing, SiretAlreadyUsed } from './Errors/authError';
import { Friperies } from './friperiesService';
import { Users } from './userService';

export class Auth {
  /**
   * Log the user and return token
   * @param email Email of the user
   * @param password Password of the user
   */
  static async login(email: string, password: string) {
    const user: User = (await getCollection(config.db_users).findOne({
      email,
    })) as unknown as User;

    if (!user) {
      throw new NotFoundException(
        "The requested email isn't associated to an account",
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new ForbiddenException("Password doesn't match");
    }

    if (user.banned) {
      throw new ForbiddenException('You are blocked from the services');
    }

    if (user.friperie) {
      const friperieUser: FriperieUser = user as unknown as FriperieUser;
      const friperieInfo = await Friperies.get(
        friperieUser.informations.oid.toString(),
      );

      const publicInfo = Format.friperiePublicInfo(friperieUser, friperieInfo);
      return Token.create(publicInfo);
    }

    return Token.create(user);
  }

  /**
   * Register the user and return token
   * @param email Email of the user
   * @param password password of the user
   * @param locale Language of the user
   * @param provider Provider used to connect
   * @param username username of the user
   */
  static async register(
    email: string,
    password: string,
    locale: string,
    provider: string,
    username?: string,
  ) {
    const user = await getCollection(config.db_users).findOne({
      email,
      provider,
    });

    if (!username) username = faker.internet.userName();

    if (user) {
      throw new BadRequestException('This email is already in use');
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hash,
      username,
      roles: ['freshen:user'],
      banned: false,
      privacy: 'public',
      active: false,
      locale,
      creationDate: new Date(),
      provider,
      description: '',
      follow: [],
      followers: [],
      block: [],
      friperie: false,
    };
    await getCollection(config.db_users).insertOne(newUser);
    return Token.create(newUser);
  }

  static async registerFriperie(
    email: string,
    password: string,
    name: string,
    siret: string,
    desc: string,
    tel: string,
    type: string,
    position: {
      lat: number;
      lng: number;
    },
  ) {
    const friperie: Friperie = (await getCollection(config.db_users).findOne({
      email,
      siret,
    })) as unknown as Friperie;

    if (friperie) {
      throw new SiretAlreadyUsed();
    }

    const hash = await bcrypt.hash(password, 10);

    const newFriperie: Friperie = {
      name: name,
      desc: desc,
      type: type,
      position: position,
      photos: [],
      avis: {},
    };

    const { insertedId } = await getCollection(config.friperies).insertOne(
      newFriperie,
    );

    const ref: DBRef = new DBRef(config.friperies, insertedId);

    const newFriperieUser: FriperieUser = {
      email: email,
      password: hash,
      tel: tel,
      siret: siret,
      valid: false,
      informations: ref,
      friperie: true,
      roles: ['freshen:friperie'],
      banned: false,
      followers: [],
      follow: [],
      privacy: 'public',
    };

    const friperieUserMongo = {
      _id: insertedId,
      ...newFriperieUser,
    };

    await getCollection(config.db_users).insertOne(friperieUserMongo);

    return Token.create(friperieUserMongo);
  }

  static createRefreshToken(id: string) {
    return Token.createRefreshToken(id);
  }

  static async refreshToken(id: string, refreshToken?: string) {
    if (!refreshToken) {
      throw new RefreshTokenMissing();
    }

    const user = await Users.getOne(id);

    return Token.create(user);
  }

  static async calculTimeLeftToken(exp: number) {
    return exp - new Date().getTime() / 1000;
  }

  static async changeEmail(email: string, id: string) {
    let user = await getUser(id);

    await Users.updateOne(id, { email: email });

    user = await getUser(id);
    return Token.create(user);
  }
}
