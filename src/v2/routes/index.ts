import express from 'express';
import { TokenHandler } from '~/middlewares/token.handler';
import { routerToken as ActualiteToken } from './actualiteRoutes';
import ArticlesRouter from './articleRoutes';
import {
  router as AuthRouter,
  routerToken as AuthRouterToken,
} from './authRoutes';
import CommentRouter from './commentRoutes';
import {
  router as FriperieRouter,
  routerToken as FriperieRouterToken,
} from './friperiesRoutes';
import GestionArticleRouter from './gestionArticleRoutes';
import { routerToken as InformationsRouterToken } from './informationsRoutes';
import TestRouter from './photoRoutes';
import PostRouter from './postRoutes';
import ProfileRouter from './profileRoutes';
import { routerToken as SuggestionRouterToken } from './suggestionRoutes';
import {
  routerPrincipalToken as UserPrincipalToken,
  router as UserRouter,
  routerToken as UserRouterToken,
} from './userRoutes';

const router = express.Router();
const withTokenRouter = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({ msg: 'Welcome to V2 API' });
});

router.use('/users', TokenHandler, UserPrincipalToken);
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/friperies', FriperieRouter);
router.use('/gestion_article', GestionArticleRouter);
router.use('/test', TestRouter);

withTokenRouter.use('/friperies', TokenHandler, FriperieRouterToken);
withTokenRouter.use('/comment', TokenHandler, CommentRouter);
withTokenRouter.use('/post', TokenHandler, PostRouter);
withTokenRouter.use('/informations', TokenHandler, InformationsRouterToken);
withTokenRouter.use('/article', TokenHandler, ArticlesRouter);
withTokenRouter.use('/users', TokenHandler, UserRouterToken);
withTokenRouter.use('/suggestion', TokenHandler, SuggestionRouterToken);
withTokenRouter.use('/profile', TokenHandler, ProfileRouter);
withTokenRouter.use('/auth', TokenHandler, AuthRouterToken);
withTokenRouter.use('/actualite', TokenHandler, ActualiteToken);
router.use(withTokenRouter);

export default router;
