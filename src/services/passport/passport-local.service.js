import passport from 'passport';
import { Strategy } from 'passport-local';
import validator from 'validator';
import debug from 'debug';
import db from '../../models';

const DEBUG = debug('dev');

const authFields = {
  usernameField: 'userid',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
};

passport.use(
  'login',
  new Strategy(authFields, async (req, userid, password, cb) => {
    try {
      const user = await db.AdPartner.findOne({
        where: {
          userid,
        },
      });

      if (!user || !user.password) {
        return cb(null, false, {
          statusCode: 404,
          code: 4040,
          message: 'Incorrect userid or password.',
        });
      }

      const checkPassword = await db.AdPartner.comparePassword(
        password,
        user.password,
      );

      if (!checkPassword) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }
      return cb(null, user, { message: 'Logged In Successfully' });
    } catch (err) {
      DEBUG(err);
      return cb(null, false, {
        code: 4000,
        statusCode: 400,
        message: err.message,
      });
    }
  }),
);

passport.use(
  'signup',
  new Strategy(authFields, async (req, userid, password, cb) => {
    try {
      const checkUserid = await db.AdPartner.checkUserid(userid);
      if (checkUserid) {
        return cb(null, false, {
          statusCode: 409,
          message: '이미 존재하는 유저아이디입니다.',
        });
      }
      if (
        !validator.isStrongPassword(password, {
          minLength: 10,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
          pointsPerUnique: 1,
          pointsPerRepeat: 0.5,
          pointsForContainingLower: 10,
          pointsForContainingUpper: 10,
          pointsForContainingNumber: 10,
          pointsForContainingSymbol: 10,
        })
      ) {
        return cb(null, false, {
          statusCode: 400,
          message: '패스워드 정책이 맞지않습니다.',
        });
      }

      const newUser = await db.AdPartner.create({
        userid,
        password,
      });

      return cb(null, newUser);
    } catch (err) {
      DEBUG(err);
      return cb(null, false, { statusCode: 400, message: err.message });
    }
  }),
);
