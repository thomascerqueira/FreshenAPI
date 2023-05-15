import { NextFunction, Request, Response } from "express";
import { logger } from '~/utils/winston';


export function logRequest(req: Request,  res: Response, next: NextFunction) {
    logger.info(`Request from ${req.ip} to ${req.baseUrl}`)
    next()
}