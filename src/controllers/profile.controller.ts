import { Request, Response } from 'express';
import { Profile } from '~/services/profileService';
import { Users } from '~/services/userService';
import { RequestWithToken } from '~/types/types';
import { Format } from '~/utils/format';

const getMineProfile = async (req: RequestWithToken, res: Response) => {
  const { _id } = req.verifiedToken;
  const user = await Users.getOne(_id);
  res.status(200).send(Format.userPublicProfile(user));
};

const getUserProfile = async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  const user = await Users.getOne(userId);
  res
    .status(200)
    .send(
      user.privacy === 'public'
        ? Format.userPublicProfile(user)
        : Format.userPrivateProfile(user),
    );
};

const blockUserProfile = async (req: RequestWithToken, res: Response) => {
  const { _id } = req.verifiedToken;
  const { id } = req.params;

  if (id === _id) {
    res.status(500).send({ message: "You can't block yourself" });
    return;
  }

  await Profile.blockUser(_id, id);
  res.status(200).send({ message: 'Sucess' });
};

const followUserProfile = async (req: RequestWithToken, res: Response) => {
  const { _id } = req.verifiedToken;
  const { id } = req.params;

  if (id === _id) {
    res.status(500).send({ message: "You can't follow yourself" });
    return;
  }

  if ((await Profile.followUser(_id, id)) === null)
    res
      .status(500)
      .send({ message: "This user blocked you ! You can't follow him" });
  res.status(200).send({ message: 'Sucess' });
};

export default {
  getMineProfile,
  getUserProfile,
  blockUserProfile,
  followUserProfile,
};
