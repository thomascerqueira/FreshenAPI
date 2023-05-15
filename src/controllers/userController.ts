import { NextFunction, Request, Response } from 'express';
import { Friperies } from '~/services/friperiesService';
import { Post } from '~/services/postService';
import { Users } from '~/services/userService';
import { FriperieUser } from '~/types/friperie';
import { RequestWithToken } from '~/types/types';
import { User } from '~/types/user';
import { Format, getFiles } from '~/utils/format';

interface Filters {
  username?: string;
}

interface blockUserBody {
  block: boolean;
  reason?: string;
}

interface blockUserParams {
  userId: string;
}

interface followUserParams {
  userId: string;
}

interface changeUsernameBody {
  username: string;
}

interface changeDescriptionBody {
  description: string;
}

interface blockOtherUser {
  otherId: string;
}

interface Favoris {
  friperieId: string;
}

interface SearchUserByUsername {
  username: string;
}

async function getUserInfoFromToken(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;

  try {
    const user = await Users.getOne(_id);

    if (user.friperie) {
      const friperieUser: FriperieUser = user as FriperieUser;
      const friperieInfo = await Friperies.get(
        friperieUser.informations.oid.toString(),
      );

      const publicInfo = Format.friperiePublicInfo(friperieUser, friperieInfo);
      res.status(200).send(publicInfo);
    } else {
      res.status(200).send(Format.userPublicProfile(user));
    }
  } catch (e) {
    return next(e);
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  const { page, pageSize, username } = req.query;
  const filter: Filters = {};
  if (username) filter.username = <string>username;
  const users = await Users.getAll(
    filter,
    parseInt(<string>page, 10),
    parseInt(<string>pageSize, 10),
  );
  const formattedUsers = {
    count: users.count,
    data: users.data.map((user: User) => {
      return Format.userPublicProfile(user);
    }),
  };
  res.status(200).send(formattedUsers);
};

const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const user = await Users.getOne(userId);
    const formattedUser = Format.userPublicProfile(user);
    res.status(200).send(formattedUser);
  } catch (error) {
    return next(error);
  }
};

const updateOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedUser = (await Users.updateOne(
      req.body.uid,
      req.body.value,
    )) as unknown as User;
    res.status(200).send(Format.userPublicProfile(updatedUser));
  } catch (err) {
    return next(err);
  }
};

const deleteOneUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await Users.delete(req.params.userId);
    const deleted = await Post.deleteAllPost(req.params.userId);
    res.status(200).send({ user: result, posts: deleted });
  } catch (err) {
    return next(err);
  }
};

async function blockUser(req: Request, res: Response, next: NextFunction) {
  const body = req.body as blockUserBody;
  const params = req.params as unknown as blockUserParams;

  try {
    const result = await Users.blockUser(
      params.userId,
      body.block,
      body.reason,
    );
    res.status(200).send({ msg: result });
  } catch (err) {
    return next(err);
  }
}

async function changeUsername(req: RequestWithToken, res: Response, next: NextFunction) {
  const { username } = req.body as changeUsernameBody;
  const { _id } = req.verifiedToken;

  try {
    await Users.changeUsername(_id, username);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function changeDescription(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { description } = req.body as changeDescriptionBody;
  const { _id } = req.verifiedToken;

  try {
    await Users.changeDescription(_id, description);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function changeProfilPicture(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;

  try {
    const files = getFiles(req);
    await Users.changeProfilePicture(_id, files![0]);

    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function changeBannerPicture(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;

  try {
    const files = getFiles(req);
    await Users.changeBannerPicture(_id, files![0]);

    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function blockOtherUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { otherId }: blockOtherUser = req.body as blockOtherUser;

  try {
    await Users.blockOtherUser(_id, otherId);

    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function unblockOtherUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { otherId }: blockOtherUser = req.body as blockOtherUser;

  try {
    await Users.unblockOtherUser(_id, otherId);

    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function addFavoris(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { friperieId }: Favoris = req.params as unknown as Favoris;

  try {
    await Users.addFavoris(_id, friperieId);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function getFavoris(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;

  try {
    const favoris = await Users.getFavoris(_id);

    res.status(200).send(favoris);
  } catch (error) {
    return next(error);
  }
}

async function deleteFavoris(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { friperieId }: Favoris = req.params as unknown as Favoris;

  try {
    await Users.deleteFavoris(_id, friperieId);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function followUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { userId }: followUserParams =
    req.params as unknown as followUserParams;

  try {
    await Users.followUser(_id, userId);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function unfollowUser(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { userId }: followUserParams =
    req.params as unknown as followUserParams;

  try {
    await Users.unfollowUser(_id, userId);
    res.status(200).send();
  } catch (error) {
    return next(error);
  }
}

async function getFollow(req: Request, res: Response, next: NextFunction) {
  const { userId }: followUserParams =
    req.params as unknown as followUserParams;

  try {
    const follow = await Users.getFollow(userId);
    res.status(200).send(follow);
  } catch (error) {
    return next(error);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  const { username }: SearchUserByUsername =
    req.params as unknown as SearchUserByUsername;

  try {
    const users = await Users.searchUserInDbByUsername(username);
    res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
}

export default {
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  blockUser,
  getUserInfoFromToken,
  changeUsername,
  changeDescription,
  addFavoris,
  getFavoris,
  deleteFavoris,
  followUser,
  unfollowUser,
  getFollow,
  getUser,
  blockOtherUser,
  unblockOtherUser,
  changeBannerPicture,
  changeProfilPicture
};
