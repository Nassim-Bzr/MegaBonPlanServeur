const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const GOOGLE_CLIENT_ID = '880678667669-pohoi5oa3mrr41v4c3fvlvlrvkml8rpk.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {

        return done(null, profile);

    }
  )
);
passport.serializeUser(function(user,done) {
    done(null,user);   
});

passport.deserializeUser(function(user,done) {
    done(null,user);   
});