const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req._parsedUrl.pathname == "/login/loginDetails" || req._parsedUrl.pathname == "/login/logOut"
        || req._parsedUrl.pathname.startsWith("/jenkinsApi/") || req._parsedUrl.pathname.startsWith("/forgotPassword/")) {
        next();
    }
    else {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized access');
        }
        let token = req.headers.authorization.split(' ')[1]
        if (token === 'null') {
            return res.status(401).send('Unauthorized access');
        }
        let payload = jwt.verify(token, 'tirF6KnobeAkr1IK6uuQ')
        if (!payload) {
            return res.status(401).send('Unauthorized access');
        }
        req.userId = payload.subject;
        next();
    }
}