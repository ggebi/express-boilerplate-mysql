import AppleStrategy from 'passport-apple';
import passport from 'passport';
import jwt from 'jsonwebtoken';

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.ACCESS_APPLE,
      teamID: process.env.TEAM_APPLE,
      keyID: process.env.KEY_APPLE,
      callbackURL: process.env.CALLBACKURL_APPLE,
      privateKeyString: `-----BEGIN PRIVATE KEY-----
${process.env.KEY_SECRET_APPLE}
-----END PRIVATE KEY-----`,
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, decodedIdToken, profile, cb) {
      let decoded = jwt.decode(decodedIdToken);
      decoded.channel = 'APPLE';
      cb(null, decoded);
    },
  ),
);
