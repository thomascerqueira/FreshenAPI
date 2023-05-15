import {Request} from "express-serve-static-core";

export interface RequestWithToken extends Request {
  token: string,
  verifiedToken: {
    _id: string,
    [key: string]: unknown
  }
}

export const Providers = {
  mail: "email",
  google: "google"
}