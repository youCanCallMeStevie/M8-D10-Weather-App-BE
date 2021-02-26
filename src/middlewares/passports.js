const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserModel = require("../services/users/schema");
const { generateTokens } = require("./tokens");

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BE_URL}/api/users/auth/googleRedirect`,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log("Google user's profile", profile);
      try {
        let user = await UserModel.findOne({ googleId: profile.id });
        console.log("user", user)
        if (!user) {
          const newUser = new UserModel({
            googleId: profile.id,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value,
            refreshTokens: [],
          });
          console.log("newUser", newUser)
          user = await newUser.save();
        }
        const tokens = generateTokens(user);
        console.log("tokens",tokens )
        user.refreshToken = tokens.refreshToken;
        done(null, { user, tokens });
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
