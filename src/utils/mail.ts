/* istanbul ignore file */
import { readFileSync } from "fs";
import { EmailType, FileMail } from "~/config";
import nodemailer from 'nodemailer'
import { logger } from '~/utils/winston';

interface BodyResetPassword {
  confirm_link: string
}

type AllBodyMail = BodyResetPassword | null

export class Mail {
  mail: any;
  
  constructor() {
    try {
      this.mail = nodemailer.createTransport({
        host: 'pro2.mail.ovh.net',
        port: 587,
        secureConnection: false,
        auth: {
          user: process.env.EMAIL_EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      })
      logger.info("Nodemailer correctly setuped")
    } catch (e) {
      console.error(`Error nodemailer`)
      console.error(e)
      process.exit(84)
    }
  }

  static generateConfirmLinkForget(uid: string) {
    return `${process.env.ADRESS_SERV}/V2/auth/forget_password/${uid}`;
  }

  async sendMail(to: string, subject: string, html: string, type: EmailType=EmailType.other, value: AllBodyMail=null, _: string="") {
    const message = {
      from: process.env.EMAIL_EMAIL,
      to: to,
      subject: subject,
      html: ""
    }

    let body: string
    let buff: Buffer
    let tmp

    switch (type) {
      case EmailType.ForgotPassword:
        tmp = value as BodyResetPassword
        buff = readFileSync(FileMail[EmailType.ForgotPassword])
        body = buff.toString().replaceAll("{{EMAIL}}", tmp.confirm_link)
        break
      default:
        body = html
        break
    }
    message['html'] = body
    await this.mail.sendMail(message)
  }
}