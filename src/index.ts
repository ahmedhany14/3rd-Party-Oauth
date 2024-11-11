import express from 'express';
import session from 'express-session';
import passport from 'passport';


const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 5000
    }
}))


app.use(passport.initialize());
app.use(passport.session());

export { app };