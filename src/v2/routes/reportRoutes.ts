/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
import reportController from '~/controllers/reportController';
import { RolesHandler } from '~/middlewares/roles.handler';
import {
  PaginationValidator,
  ReportValidator,
  Validator,
} from '~/middlewares/validators.handler';

const router = express.Router();

/**
 * @api {get} /report Request report list
 * @apiName getReport
 * @apiGroup Report
 * @apiVersion 2.0.0
 *
 * @apiQuery {Number{0..}} page
 * @apiQuery {Number{0..100}} pageSize
 * @apiQuery {String} userId (optional)
 * @apiQuery {String} postId (optional)
 * @apiQuery {String} commentId (optional)
 *
 * @apiSuccess (200) {Number} count
 * @apiSuccess (200) {Object[]} data
 */
router.get(
  '/',
  RolesHandler.isAdmin,
  PaginationValidator.checkPagination(),
  Validator.confirm,
  reportController.getAllReport,
);

/**
 * @api {post} /report Create a report
 * @apiName createReport
 * @apiGroup Report
 * @apiVersion 2.0.0
 *
 * @apiBody {String} report type (user, post, comment)
 * @apiBody {String} description of the report
 * @apiBody {String} reported id
 *
 * @apiSuccess (200) {String} report Id
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
router.post(
  '/',
  ReportValidator.createReport(),
  Validator.confirm,
  // @ts-ignore
  reportController.createReport,
);

export default router;
