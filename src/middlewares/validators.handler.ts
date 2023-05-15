import { NextFunction, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { config } from '~/config';
import { BadRequestException } from '~/utils/exceptions';
import { logger } from '~/utils/winston';

export class Validator {
  /**
   * confirm Validators Middleware
   *
   * @param req - The initial request
   * @param res - The response object
   * @param next - Allows you to switch to the next middleware if existing
   */
  static confirm(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }
    logger.info('Access granted to the requested resources');
    next();
  }
}

export class ReportValidator extends Validator {
  static createReport() {
    return checkSchema({
      type: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'You need to specify a type',
          bail: true,
        },
      },
      reportedId: {
        in: ['body'],
        errorMessage: 'You need to specify a reported ID',
      },
      category: {
        in: ['body'],
        errorMessage: 'You need to specify a category',
      },
      description: {
        in: ['body'],
        optional: true,
      },
    });
  }
}

export class PaginationValidator extends Validator {
  /**
   * checkPagination Validators Middleware
   */
  static checkPagination() {
    return checkSchema({
      page: {
        in: ['query'],
        isEmpty: {
          negated: true,
          errorMessage: '',
          bail: true,
        },
        isInt: {
          bail: true,
          errorMessage: 'page need to be superior or equal to 0',
          options: {
            min: 0,
          },
        },
      },
      pageSize: {
        in: ['query'],
        isEmpty: {
          negated: true,
          bail: true,
          errorMessage: 'pageSize is missing',
        },
        isInt: {
          bail: true,
          errorMessage: 'pageSize need to be superior or equal to 0',
          options: {
            min: 0,
          },
        },
      },
    });
  }
}

export class AuthValidator extends Validator {
  static checkChangeEmail() {
    return checkSchema({
      email: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'email is missing',
          bail: true,
        },
        isEmail: {
          errorMessage: 'Email is wrongly formated',
          bail: true,
        },
      },
    });
  }

  static checkLogin() {
    return checkSchema({
      email: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'email is missing',
          bail: true,
        },
        isEmail: {
          errorMessage: 'Email is wrongly formated',
          bail: true,
        },
      },
      password: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'password is missing',
          bail: true,
        },
      },
    });
  }

  static checkRegister() {
    return checkSchema({
      email: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'email is missing',
          bail: true,
        },
        isEmail: {
          errorMessage: 'Email is wrongly formated',
          bail: true,
        },
      },
      password: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'password is missing',
          bail: true,
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          },
          errorMessage: "Your password isn't strong enough",
          bail: true,
        },
      },
      username: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'username is missing',
          bail: true,
        },
      },
      provider: {
        customSanitizer: {
          options: (value, { req }) => {
            if (!req.body.provider) {
              return 'email';
            }
            return req.body.provider;
          },
        },
      },
      description: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'description is missing',
          bail: true,
        },
      },
      type: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'type is missing',
          bail: true,
        },
      },
      position: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'position is missing',
          bail: true,
        },
        custom: {
          options: (value, { req }) => {
            if (!value.lat) {
              throw new Error('lat is missing');
            }
            if (!value.lng) {
              throw new Error('lng is missing');
            }
            return true;
          },
        },
      },
      siret: {
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'siret is missing',
          bail: true,
        },
      },
      tel: {
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'siret is missing',
          bail: true,
        },
      },
      friperie: {
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'friperie is missing',
          bail: true,
        },
        custom: {
          options: (value, { req }) => {
            if (!value) {
              return true;
            }

            if (!req.body.description) {
              throw new Error('description is missing');
            }

            if (!req.body.type) {
              throw new Error('type is missing');
            }

            if (!req.body.siret) {
              throw new Error('siret is missing');
            }

            if (!req.body.tel) {
              throw new Error('tel is missing');
            }

            if (!req.body.position) {
              throw new Error('position is missing');
            }
            return true;
          },
        },
      },
    });
  }
}

export class UserValidator extends Validator {
  static checkBlock() {
    return checkSchema({
      userId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'userId is missing',
          bail: true,
        },
      },
      block: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'block is missing',
          bail: true,
        },
      },
    });
  }

  static delete() {
    return checkSchema({
      userId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'userId is missing',
          bail: true,
        },
      },
    });
  }

  static changeUsername() {
    return checkSchema({
      username: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'username is missing',
          bail: true,
        },
      },
    });
  }

  static blockUnblockUser() {
    return checkSchema({
      otherId: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'otherId is missing',
          bail: true,
        },
      },
    });
  }

  static changeDescription() {
    return checkSchema({
      description: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'description is missing',
          bail: true,
        },
      },
    });
  }

  static favoris() {
    return checkSchema({
      friperieId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'friperieId is missing',
          bail: true,
        },
      },
    });
  }

  static follow() {
    return checkSchema({
      userId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'userId is missing',
          bail: true,
        },
      },
    });
  }

  static searchUserByUsername() {
    return checkSchema({
      username: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'username is missing',
          bail: true,
        },
      },
    });
  }
}

export class ForgetPasswordValidator extends Validator {
  static checkForgetPassword() {
    return checkSchema({
      email: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'email is missing',
          bail: true,
        },
      },
    });
  }

  static checkSendPageReset() {
    return checkSchema({
      uid: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'uid is missing',
          bail: true,
        },
      },
    });
  }

  static checkChangePassword() {
    return checkSchema({
      uid: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'uid is missing',
          bail: true,
        },
      },
      password: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'password is missing',
          bail: true,
        },
      },
    });
  }
}

export class PostValidator extends Validator {
  static createPost() {
    return checkSchema({
      description: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'description is missing',
          bail: true,
        },
      },
    });
  }

  static getPost() {
    return checkSchema({
      postId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
    });
  }

  static like() {
    return checkSchema({
      postId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
      like: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'like is missing',
          bail: true,
        },
      },
    });
  }

  static delete() {
    return checkSchema({
      postId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
    });
  }
}

export class SuggestionValidator {
  static add() {
    return checkSchema({
      brand: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
      article: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'article is missing',
          bail: true,
        },
      },
      price: {
        in: ['body'],
      },
      coton: {
        in: ['body'],
      },
      water: {
        in: ['body'],
      },
      comment: {
        in: ['body'],
      },
    });
  }
}

export class ArticleValidator {
  static add() {
    return checkSchema({
      brand: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
      article: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'article is missing',
          bail: true,
        },
        custom: {
          options: (value) => {
            if (
              !config.articleType.includes(value.toLocaleLowerCase() as never)
            ) {
              throw new Error(
                `Type should be one of ${config.articleType.toString()}`,
              );
            }
            return true;
          },
        },
      },
      number: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'number is missing',
          bail: true,
        },
      },
      price: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'price is missing',
          bail: true,
        },
      },
    });
  }

  static getOne() {
    return checkSchema({
      idArticle: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'idArticle is missing',
          bail: true,
        },
      },
    });
  }

  static modifOne() {
    return checkSchema({
      idArticle: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'idArticle is missing',
          bail: true,
        },
      },
      brand: {
        in: ['body'],
      },
      price: {
        in: ['body'],
      },
      article: {
        in: ['body'],
        custom: {
          options: (value) => {
            if (value == null) {
              return true;
            }

            if (
              !config.articleType.includes(value.toLocaleLowerCase() as never)
            ) {
              throw new Error(
                `Type should be one of ${config.articleType.toString()}`,
              );
            }
            return true;
          },
        },
      },
    });
  }
}

export class FriperiesValidator extends Validator {
  static CreateFriperie() {
    return checkSchema({
      name: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'name is missing',
          bail: true,
        },
      },
      description: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'description is missing',
          bail: true,
        },
      },
      type: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'type is missing',
          bail: true,
        },
      },
      position: {
        in: ['body'],
        custom: {
          options: (value) => {
            return value.lat != null && value.lng != null;
          },
          errorMessage: 'position need lat and lng as parameters',
        },

        isEmpty: {
          negated: true,
          errorMessage: 'position is missing',
          bail: true,
        },
      },
    });
  }

  static UpdateFriperie() {
    return checkSchema({
      id: {
        in: ['params'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'id is missing',
          bail: true,
        },
      },
      name: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'name is missing',
          bail: true,
        },
      },
      description: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'description is missing',
          bail: true,
        },
      },
      type: {
        in: ['body'],
        optional: true,
        isEmpty: {
          negated: true,
          errorMessage: 'type is missing',
          bail: true,
        },
      },
      position: {
        in: ['body'],
        optional: true,
        custom: {
          options: (value) => {
            return value.lat != null && value.lng != null;
          },
          errorMessage: 'position need lat and lng as parameters',
        },

        isEmpty: {
          negated: true,
          errorMessage: 'position is missing',
          bail: true,
        },
      },
    });
  }

  static GetFriperie() {
    return checkSchema({
      friperieId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
    });
  }

  static UpdatePhoto() {
    return checkSchema({
      id: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
    });
  }

  static LetAvis() {
    return checkSchema({
      id: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'postId is missing',
          bail: true,
        },
      },
      comment: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'comment is missing',
          bail: true,
        },
      },
      note: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'note is missing',
          bail: true,
        },
        custom: {
          options: (value) => {
            return value > 0 && value <= 5;
          },
          errorMessage: 'Bad value for note',
        },
      },
    });
  }

  static Avis() {
    return checkSchema({
      id: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'friperieId is missing',
          bail: true,
        },
      },
    });
  }

  static GetAvis() {
    return checkSchema({
      id: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'friperieId is missing',
          bail: true,
        },
      },
      userId: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'userId is missing',
          bail: true,
        },
      },
    });
  }
}

export class GestionArticleValidator extends Validator {
  static addBrand() {
    return checkSchema({
      brand: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
    });
  }

  static changePhoto() {
    return checkSchema({
      brand: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
    });
  }

  static getArticleInBrand() {
    return checkSchema({
      brand: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
      article: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'article is missing',
          bail: true,
        },
        custom: {
          options: (value) => {
            if (
              !config.articleType.includes(value.toLocaleLowerCase() as never)
            ) {
              throw new Error(
                `Type should be one of ${config.articleType.toString()}`,
              );
            }
            return true;
          },
        },
      },
    });
  }

  static addArticleToBrand() {
    return checkSchema({
      brand: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
      article: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'type is missing',
          bail: true,
        },
        custom: {
          options: (value) => {
            if (
              !config.articleType.includes(value.toLocaleLowerCase() as never)
            ) {
              throw new Error(
                `Type should be one of ${config.articleType.toString()}`,
              );
            }
            return true;
          },
        },
      },
      cost: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'cost is missing',
          bail: true,
        },
      },
      coton: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'coton is missing',
          bail: true,
        },
      },
      water: {
        in: ['body'],
        isEmpty: {
          negated: true,
          errorMessage: 'water is missing',
          bail: true,
        },
      },
    });
  }

  static getBrand() {
    return checkSchema({
      brand: {
        in: ['params'],
        isEmpty: {
          negated: true,
          errorMessage: 'brand is missing',
          bail: true,
        },
      },
    });
  }
}
