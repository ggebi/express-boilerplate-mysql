import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';

passport.use(
  'google',
  new OAuth2Strategy(
    {
      clientID: process.env.ACCESS_GOOGLE,
      clientSecret: process.env.SECRET_GOOGLE,
      callbackURL: process.env.CALLBACKURL_GOOGLE,
    },
    function (accessToken, refreshToken, profile, done) {
      let data = {
        channel: 'GOOGLE',
        email: profile.emails[0].value,
        nickname: profile.displayName,
        socialId: profile.id,
      };
      done(null, data);
    },
  ),
);
