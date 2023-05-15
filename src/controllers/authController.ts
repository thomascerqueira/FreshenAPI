import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { Auth } from '~/services/authService';
import { RequestWithToken } from '~/types/types';
import { Token } from '~/utils/token';

interface LoginBody {
  email: string;
  password: string;
  provider: string;
}

interface RegisterBody {
  email: string;
  password: string;
  username: string;
  friperie?: boolean;
  provider?: string;

  description?: string;
  type?: string;
  position?: {
    lat: number;
    lng: number;
  };
  siret?: string;
  tel?: string;
}

interface ChangeEmail {
  email: string;
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, provider }: LoginBody = req.body;

  try {
    const token = await Auth.login(email, password);
    const decoded = Token.decode(token);
    const id = decoded!['_id'];
    const refreshToken = Auth.createRefreshToken(id);

    res
      .status(201)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'developement' ? false : true,
      })
      .send({ token });
  } catch (err) {
    return next(err);
  }
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    email,
    password,
    username,
    provider,
    friperie,
    description,
    type,
    position,
    siret,
    tel,
  }: RegisterBody = req.body;
  const locale = req.headers['accept-language'] as string;

  try {
    let token: string;

    if (friperie) {
      token = await Auth.registerFriperie(
        email,
        password,
        username,
        siret!,
        description!,
        tel!,
        type!,
        position!,
      );
    } else {
      token = await Auth.register(email, password, locale, provider!, username);
    }

    const decoded = Token.decode(token);
    const id = decoded!['_id'];

    const refreshToken = Auth.createRefreshToken(id);

    res
      .status(201)
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'developement' ? false : true,
      })
      .send({ token });
  } catch (err) {
    return next(err);
  }
};

async function refreshToken(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;

  try {
    const token = await Auth.refreshToken(_id, req.cookies?.refresh_token);

    res.status(201).send({ token });
  } catch (error) {
    return next(error);
  }
}

async function getTokenInformation(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { exp } = req.verifiedToken;

  try {
    res.status(201).send({
      time_left: await Auth.calculTimeLeftToken(exp as number),
    });
  } catch (error) {
    return next(error);
  }
}

async function changeEmail(
  req: RequestWithToken,
  res: Response,
  next: NextFunction,
) {
  const { _id } = req.verifiedToken;
  const { email }: ChangeEmail = req.body as ChangeEmail;

  try {
    const token = await Auth.changeEmail(email, _id);
    res.status(200).send({ token });
  } catch (error) {
    return next(error);
  }
}

export default {
  loginUser,
  registerUser,
  refreshToken,
  getTokenInformation,
  changeEmail,
};
