import { config, EmailType } from "../config";
import { User } from "../types/user";
import { NotFoundException } from "../utils/exceptions";
import { Mail } from "../utils/mail";
import { getCollection } from "../utils/mongo";
import { Users } from "./userService";
import bcrypt from 'bcrypt';

export class ForgetPassword {
  /**
   * Send email to reset password
   * @param email Mail of the user
   */
  static async generateLinkForgetPassword(email: string) {
    const user: User = await getCollection(config.db_users).findOne({
      email,
      provider: "email"
    }) as unknown as User;

    if (!user) {
      throw new NotFoundException("User not found")
    }

    await config.mail.sendMail(email, "Reset Password", "", EmailType.ForgotPassword, {
      confirm_link: Mail.generateConfirmLinkForget(user._id.toString())
    })
  }

  /**
   * Change password of a user
   * @param uid Uid of the user
   * @param password New password
   */
  static async changePassword(uid: string, password: string) {
    const user = await Users.getOne(uid)

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const hash = await bcrypt.hash(password, 10)
    return await Users.updateOne(uid, {
      password: hash
    })
  }
}