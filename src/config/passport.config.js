/**
 * Passport configuration file
 */
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import dotenv from 'dotenv';
import { ApplicationError } from '../helpers/errors.helper';
import db from '../models/index';

dotenv.config();

if (!process.env.JWT_KEY) {
  throw new ApplicationError(
    404,
    'Please provide a JWT_KEY as global environment variable',
  );
}
const jwtKey = process.env.JWT_KEY;

/**
 * Extract the jwt token from a custom Cookie Extractor function which
 * extracts the token from a named token and from a Bearer Token
 * @param req
 * @return {null}
 */
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  return token;
};

const options = {
  secretOrKey: jwtKey,
  // algorithms: ['RS256'],
  passReqToCallback: true,
  session: false,
};

options.jwtFromRequest = ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(),
  (req) => cookieExtractor(req),
]);

passport.use(
  new Strategy(options, (req, jwtPayload, done) => {
    try {
      db.User.findOne({ where: { id: jwtPayload.userId } })
        .then((user) => {
          if (!user) {
            return done(null, false);
          } else {
            // eslint-disable-next-line no-param-reassign
            delete user.password;
            done(null, user);
          }
        })
        .catch((err) => {
          if (err) {
            return done(err, false);
          }
        });
    } catch (err) {
      if (err) {
        return done(err, false);
      }
    }
  }),
);

export default passport;
