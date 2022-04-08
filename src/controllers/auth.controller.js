import passport from 'passport';
import '../services/passport/passport-local.service';
import { ApplicationError } from '../helpers/errors.helper';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJti,
} from '../services/jwt/jwt.service';

/**
 * This function returns a json with user data,
 * token and the status and set a cookie with
 * the name jwt. We use this in the response
 * of login or signup
 * @param user
 * @param statusCode
 * @param req
 * @param res
 */
// const createCookieFromToken = async (user, statusCode, req, res) => {
//   const accessToken = await generateAccessToken(
//     user.no,
//     user.userid,
//     user.level,
//   );
//   const refreshToken = await generateRefreshToken(user.no, user.userid);

//   res.status(statusCode).json({
//     code: 2000,
//     accessToken,
//     refreshToken,
//     data: {
//       nickname: user.nickname,
//     },
//   });
// };

const createToken = async (user, statusCode, req, res) => {
  const accessToken = await generateAccessToken(
    user.no,
    user.name,
    user.isAddAdmin,
  );
  const refreshToken = await generateRefreshToken(
    user.no,
    user.name,
    user.isAddAdmin,
  );

  res.status(statusCode).json({
    code: 2000,
    accessToken,
    refreshToken,
    data: {
      admin: user,
    },
  });
};

export default {
  /**
   *
   * @param req
   * @param res
   * @param next
   * @return {Promise<void>}
   */
  signup: async (req, res, next) => {
    passport.authenticate(
      'signup',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const { statusCode = 400, message } = info;
            return res.status(statusCode).json({
              status: 'error',
              error: {
                message,
              },
            });
          }
          createToken(user, 201, req, res);
        } catch (error) {
          throw new ApplicationError(500, error);
        }
      },
    )(req, res, next);
  },
  /**
   * Login controller
   * @param req
   * @param res
   * @param next
   */
  login: async (req, res, next) => {
    passport.authenticate(
      'login',
      { session: false },
      async (err, user, info) => {
        try {
          if (err || !user) {
            const message = err;
            return res.status(401).json({
              code: info.code ?? 4010,
              msg: info.message ?? message,
            });
          }

          await createToken(user, 200, req, res);
        } catch (error) {
          throw new ApplicationError(500, error);
        }
      },
    )(req, res, next);
  },
  /**
   * Logout controller that delete cookie named jwt
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  logout: async (req, res) => {
    try {
      await req.session.destroy();
      await res.clearCookie('jwt');
      return res.status(200).json({
        status: 'success',
        message: 'You have successfully logged out',
      });
    } catch (error) {
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Token refresh controller
   * @param {*} req
   * @param {*} res
   */
  refresh: async (req, res) => {
    try {
      const token = req.currentUser;

      // refresh 토큰이 맞는지 확인
      // refresh 토큰의 jti가 맞는지 확인
      if (token.type !== 'refresh') {
        return res.status(401).json({
          code: 4010,
          msg: 'refresh 토큰이 아닙니다.',
        });
      } else if ((await verifyJti(token.userId, token.jti)) !== true) {
        return res.status(401).json({
          code: 4010,
          msg: '유효한 토큰이 아닙니다.',
        });
      }

      await createToken(req.user, 200, req, res);
    } catch (error) {
      throw new ApplicationError(500, error);
    }
  },
  check: async (req, res) => {
    try {
      return res.status(200).json({ code: 2000, msg: '유효한 토큰' });
    } catch (error) {
      throw new ApplicationError(500, error);
    }
  },
};
