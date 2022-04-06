import passport from 'passport';
import debug from 'debug';
import { ApplicationError } from '../helpers/errors.helper';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJti,
} from '../services/jwt/jwt.service';
import AuthSocial from '../services/auth.service';
import '../services/passport/passport-local.service';
import '../services/passport/passport-google.service';

const DEBUG = debug('dev');

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
const createCookieFromToken = async (user, statusCode, req, res) => {
  const accessToken = await generateAccessToken(
    user.no,
    user.userid,
    user.level,
  );
  const refreshToken = await generateRefreshToken(user.no, user.userid);

  res.status(statusCode).json({
    code: 2000,
    accessToken,
    refreshToken,
    data: {
      nickname: user.nickname,
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
          createCookieFromToken(user, 201, req, res);
        } catch (error) {
          DEBUG(error);
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
          // generate a signed json web token with the contents of user
          // object and return it in the response
          await createCookieFromToken(user, 200, req, res);
        } catch (error) {
          DEBUG(error);
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
      DEBUG(error);
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

      await createCookieFromToken(req.user, 200, req, res);
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  check: async (req, res) => {
    try {
      return res.status(200).json({ code: 2000, msg: '유효한 토큰' });
    } catch (error) {
      DEBUG(error);
      throw new ApplicationError(500, error);
    }
  },
  /**
   * Protected router test
   * @param req
   * @param res
   * @return {Promise<void>}
   */
  protectedRoute: async (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Yes you are. You are a Thor-n times developer',
      },
    });
  },
  googleAuthenticate: (req, res, next) => {
    try {
      passport.authenticate('google', {
        scope: ['profile', 'email'],
      })(req, res, next);
    } catch (error) {
      console.error(error);
      throw new AuthenticationError(error);
    }
  },
  appleAuthenticate: (req, res, next) => {
    try {
      passport.authenticate('apple')(req, res, next);
    } catch (error) {
      console.error(error);
      throw new AuthenticationError(error);
    }
  },
  loginSocialGoogle: (req, res, next) => {
    try {
      passport.authenticate(
        'google',
        { failureRedirect: '/' },
        async (err, data) => {
          const socialUser = await AuthSocial.findSocial(data);

          if (socialUser)
            await createCookieFromToken(socialUser, 201, req, res);
          else {
            return res.status(404).json({
              code: 4040,
              msg: '유저를 찾을수 없습니다..',
            });
          }
        },
      )(req, res, next);
    } catch (error) {
      console.error(error);
      throw new ApplicationError(500, error);
    }
  },
  loginSocialApple: (req, res, next) => {
    try {
      passport.authenticate('apple', async (err, data) => {
        data = {
          channel: data.channel,
          socialId: data.sub,
        };
        const socialUser = await AuthSocial.findSocial(data);

        if (socialUser) await createCookieFromToken(socialUser, 201, req, res);
        else {
          return res.status(404).json({
            code: 4040,
            msg: '유저를 찾을수 없습니다..',
          });
        }
      })(req, res, next);
    } catch (error) {
      console.error(error);
      throw new ApplicationError(500, error);
    }
  },
};
