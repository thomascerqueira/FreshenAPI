import { MongoClient, ObjectId } from 'mongodb';
import { config } from '~/config';
import { logger } from './winston';

// Connection URI
const uri = <string>config.mongoURL;

// Create a new MongoClient
export const client = new MongoClient(uri);

export const toObjectId = (id) => {
  return ObjectId.createFromHexString(id);
};

let db = client.db('Test');
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') {
  db = client.db('Freshen');
}

export { db };

export const getCollection = (collection: string) => {
  return db.collection(collection);
};

export async function closeDb() {
  await client.close();
}

export async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Establish and verify connection
    await db.command({ ping: 1 });
    logger.info('Successfully connected to server');
  } catch (e) {
    /* istanbul ignore next */
    logger.error('Mongo connexion error', e);
    /* istanbul ignore next */
    await client.close();
  }
}
