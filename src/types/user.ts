export interface User {
  _id: string;
  email: string;
  username: string;
  locale: string;
  creationDate: Date;
  roles: Array<string>;
  active: boolean;
  privacy: string;
  banned: boolean;
  password: string;
  description: string;
  provider: string;
  follow: Array<string>;
  followers: Array<string>;
  block: Array<string>;
  favoris: Array<string>;
  friperie: false;
}
