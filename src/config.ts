import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { Mail } from './utils/mail';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_ATUH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export enum EmailType {
  ForgotPassword,
  ResetPassword,
  PasswordReseted,
  other,
}

export const FileMail = {
  0: './Templates/ForgotPassword.html',
  1: './Templates/ResetPassword.html',
  2: './Templates/PasswordReseted.html',
};

const app = initializeApp(firebaseConfig);
let mail;
const storage = getStorage(app);

let privateKey = 'test';
const mongoUrl = process.env.MONGO_URL!;
let adressServ = 'https://api-freshen.azurewebsites.net';
let expirationTime = '1h';
let port = '3000';

/* istanbul ignore if */
if (process.env.NODE_ENV == "developement") {
  adressServ = 'http://localhost:3000'
}

/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  privateKey = <string>process.env.JWT_SECRET;
  adressServ = <string>process.env.ADRESS_SERV;
  expirationTime = <string>process.env.EXPIRES_IN;
  port = <string>process.env.API_PORT;
  mail = new Mail();
}

export const config = {
  app: app,
  storage: storage,
  API_PORT: port,
  ADRESS_SERV: adressServ,
  mongoURL: mongoUrl,
  privateKey: privateKey,
  tokenExpirationTime: expirationTime,
  db: "freshen",
  db_users: 'users',
  db_users_deleted: 'users_deleted',
  db_post: 'post',
  db_post_deleted: 'post_deleted',
  db_comment: 'comment',
  db_report: 'report',
  db_friperie_users: 'friperie_users',
  friperies: 'friperies',
  db_info_articles: "info_articles",
  db_types_article: "types_article",
  db_articles: "articles",
  db_suggestion: "suggestion",
  email: process.env.EMAIL_EMAIL,
  articleType: [],
  photosArticle: [],
  mail: mail,
};
