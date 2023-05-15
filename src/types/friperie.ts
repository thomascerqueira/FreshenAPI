import { DBRef } from 'mongodb';
import { Avis } from './avis';

export interface Friperie {
  name: string;
  desc: string;
  type: string;
  position: {
    lat: number;
    lng: number;
  };
  photos: string[];
  avis: { [key: string]: Avis };
}

export interface FriperieUser {
  friperie: true;
  email: string;
  password: string;
  tel: string;
  siret: string;
  valid: boolean;
  informations: DBRef;
  roles: string[];
  banned: boolean;
  follow: Array<string>;
  followers: Array<string>;
  privacy: string;
}
