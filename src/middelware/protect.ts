import { User } from '../model/userModel';
import jwt from 'jsonwebtoken';
/*
Why do we need this middleware?

the protect middleware is used to protect routes that require a user to be logged in, or higher privileges to access.
ex: no one can access the dashboard page or post a new blog post without being logged in.

protecting middleware notes and steps:

1) you need to get the token from the request, if there is no token, then the user is not logged in. ✅

2) check if the token is valid  ✅
    - we use the jsonwebtoken library to verify the token ✅
    - the method jwt.verify(token, secret) will return the payload if the token is valid, otherwise it will throw an error. ✅

3) if the token is valid, the verify method will return the payload, which is an object that contains the user's id, the time the token was created and the time the token will expire. ✅

4) we need to check if the user still exists in the database, if the user has been deleted, then the token is invalid. ✅

5) if the user exists, we need to check if the token has expired, by checking if passwordChangedAt is greater than the time the token was created. ✅
    - we will create a method in the user model that will check if the password has been changed after the token was created. ✅
    - in this function we will compare the time the password was changed with the time the token was created. ✅

6) if the token is valid, we need to attach the user object to the request object, so that the next middleware can access it. ✅
 */

interface tokenID {
    id: string;
    iat: number;
    exp: number;
}
const protect = (async (request: any, response: any) => {
    if (!request.headers.cookie) {
        response.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        });
    }

    // 1) get the token from the request and check if there is no token or not in the cookie
    const token = request.headers.cookie.split('=')[1];

    if (!token) {
        return response.status(401).json({
            status: 'fail',
            message: 'You are not logged in! Please log in to get access.'
        });
    }

    // 2) check if the token is valid, more formally verify the token and construct the payload

    const token_data = await jwt.verify(token, process.env.JWT_SECRET as string);

    console.log(token_data);
    const id: string = (token_data as tokenID).id;
    // 3) check if the user still exists in the database
    const user = await User.findById(id);
    if (!user) {
        return response.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token does no longer exist.'
        });
    }

    // 4) Check if the password was changed after the token was created or not.
    //if (user.compareTimeIfChanged(token_data.iat)) return next(new AppError('The password was changed, please login again.', 401));

    // 5) attach the user object to the request object
    user.password = "";
    request.user = user;
    response.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
})

export { protect };