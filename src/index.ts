import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { loginRouter } from './routes/loginRoutes';
const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 10000
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginRouter);


export { app };