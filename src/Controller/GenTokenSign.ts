import { request } from "express";

const jwt = require("jsonwebtoken");

const tokenGenerator = async (id: string) => {
    // jwt have 3 methods: sign, verify, decode
    // to create a new token you should use the sign method to create a signature
    // sign method takes 2 parameters: the payload (id) and the secret key, and the options object like the expiration time
    const token = jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    return token;
}

const createToken = async (user: any, statusCode: any, response: any) => {
    // 1) create the token
    const token = await tokenGenerator(user._id);

    // 2) fill cookie options
    /*
        response cookie method takes 3 parameters:
        1- the name of the cookie
        2- the value of the cookie or token in this case
        3- the options object that contains the expiration time of the cookie and the secure option to make the cookie only available in the https protocol
    */
    const ex: any = process.env.COOKIE_EXPIRATION;
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000 * ex
        ),
        httpOnly: true
    }
    // send the cookie to the client side in the response
    response.cookie('jwt', token, cookieOptions);

    // 3) send the token to the client side and make password undefined to not send it to the client side
    user.password = undefined;
    response.status(statusCode).json({
        status: 'success',
        data: {
            token,
            user
        }
    });
}

export { createToken as Generator };