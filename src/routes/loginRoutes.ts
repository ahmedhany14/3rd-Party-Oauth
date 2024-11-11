import express from 'express';
import { passport } from './../GoogleStrategyConfig/GoogleConfig';

const router = express.Router();

/*
Understand the following code:

if the user hits the /login/google route, the user will be redirected to the Google OAuth consent screen.
The user will be asked to log in to their Google account.
The user will be asked to grant permission to our app to access their Google profile and email.
If the user grants permission, Google will redirect the user back to our app at the /login/google/callback route.
At this point, the user will be authenticated and we can access their profile and email.
At the end we can create a token and send it to the user.
*/
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.status(200).json({
            message: 'User authenticated',
            user: req.user,
            is_auth: req.isAuthenticated()
        });
    }
)
export { router as loginRouter };