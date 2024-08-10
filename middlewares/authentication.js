const {validateToken} = require('../service/authentication')
function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        console.log(tokenCookieValue);
        if (!tokenCookieValue) {
            console.log('No token found in cookies');
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            // console.log('User payload:', userPayload); // Log the userPayload
            req.user = userPayload;
        } catch (error) {
            console.error('Token validation error:', error.message); // Log any validation errors
        }

        return next();
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
