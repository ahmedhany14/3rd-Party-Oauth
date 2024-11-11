import passport from "passport";
import { User } from "./../model/userModel";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

interface UserInterface {
    id: string
};
// Srializr function used to store the user in the session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user: UserInterface, done) => {
    done(null, user);
})

const GoogleStrategyConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: '/login/google/callback'
}

passport.use(new GoogleStrategy(GoogleStrategyConfig, async function (accessToken, refreshToken, profile, done) {

    const { name, email } = profile._json;
    const user = await User.findOne({ email });

    if (user) return done(null, user);

    const newUser = await new User({
        name,
        email
    }).save({
        validateBeforeSave: false
    });

    return done(null, newUser);
}));


export { passport };