import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser'
import { config } from '~/config';
import { ExceptionsHandler } from '~/middlewares/exceptions.handler';
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler';
import { run } from '~/utils/mongo';
import { logger } from '~/utils/winston';
import v2Router from '~/v2/routes';
import { logRequest } from './middlewares/log.handler';
import { generateLinkArticlePhoto } from './utils/articles';
import { queryParser } from 'express-query-parser';
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  })
)
app.use(cookieParser())

if (process.env.NODE_ENV === 'developement')
  app.use('/doc', express.static('doc'));

app.use('*', logRequest)

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Welcome to Freshen api' });
});

app.use('/v2', v2Router);
app.all('*', UnknownRoutesHandler);
app.use(ExceptionsHandler);

async function startMongo() {
  await run().catch(console.dir);
}

startMongo().then(async () => {
  try {
    const photosArticle = (await generateLinkArticlePhoto()) as never[];

    config.photosArticle = photosArticle;
  } catch (error) {
    logger.error('Problem while getting photo articles', error);
  }

  app.listen(config.API_PORT, () => {
    logger.info(`Example app listening on port ${config.API_PORT}!`);
  });
});
