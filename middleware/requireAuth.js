const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {

    // verify authentication
    // req headers contains an authorization property sent to the server
    const { authorization } = req.headers;

    // first we have to make sure that there indeed is an authorization property
    // before moving on to the next
    if (!authorization) {
        // code 401 = not authorized
        // return it, so further code doesn't run
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // authorization property will retun a space separated string: "Bearer <TOKEN>"
    // and we will only need the <TOKEN> part
    const token = authorization.split(" ")[1];

    // next we need to verify that the toke has not been tampered with
    // using a try catch statement
    try {
        // verify() takes the token and the server's secret code that was used to encode the token 
        // it then returns the token payload
        // we retrieve the user's id from the payload
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)

        // because this middleware runs before all the request handler functions
        // we can attach a "user" property to the req object
        // exclude the password from user document to be sent along
        req.user = await User.findOne({ _id }).select("-password");

        // ... and move on to the next handler function, if everything is successful
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: "Unauthorized request" });
    }

};

module.exports = requireAuth;