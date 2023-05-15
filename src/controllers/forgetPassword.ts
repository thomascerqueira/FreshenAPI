import { NextFunction, Request, Response } from "express";
import { readFileSync } from "fs";
import path from "path";
import { EmailType, FileMail } from "../config";
import { ForgetPassword } from "../services/fogetPasswrodService";

export interface BodyForgetPassword {
  email: string
}

interface ChangePasswordParams {
  uid: string
}

interface ChangePasswordBody {
  password: string
}

async function generateConfirmLinkForget(req: Request, res: Response, next: NextFunction) {
  const {email}: BodyForgetPassword = req.body

  try {
    await ForgetPassword.generateLinkForgetPassword(email)
    res.status(200).send({msg: "Mail send"})
  } catch (err) {
    return next(err)
  }
}

async function sendPageReset(req: Request, res: Response, next: NextFunction) {
  try {
    res.sendFile(path.resolve(FileMail[EmailType.ResetPassword]))
  } catch (err) {
    return next(err)
  }
}

async function changePassword(req: Request, res: Response, next: NextFunction) {
  const {uid}: ChangePasswordParams = req.params as unknown as ChangePasswordParams;
  const {password}: ChangePasswordBody = req.body

  try {
    await ForgetPassword.changePassword(uid, password)
    const buff = readFileSync(FileMail[EmailType.PasswordReseted])
    let bodyHTML = buff.toString().replaceAll("{{CONTAINER_TYPE}}", "container")
    bodyHTML = bodyHTML.replaceAll("{{MESSAGE}}", "Password reseted you can now close the page")
    res.status(200).send(bodyHTML)
  } catch (err) {
    return next(err)
  }
}

export default {
  generateConfirmLinkForget,
  sendPageReset,
  changePassword
}