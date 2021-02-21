module.exports = function (req, res, next){

    // This is the middleware that authenticates and authorizes user requests.
    // This will not be implemented this way in a real world production application.
    // JSON Web Tokens is the ideal way to implement this in production.

    const checkRoutes = ['currencies', 'transactions'];

    const path = req.path.split('/')[1];

    if (checkRoutes.includes(path)) {

        const userId = req.signedCookies.id;
        const apiKey = req.signedCookies.auth;

        const connection = require('../lib/connection');

        connection.query(
            "SELECT ApiKey FROM Users WHERE id = ?",
            [userId],
            function (error, results) {
                if (error || results[0].ApiKey !== apiKey) {
                    res.status(401).json({ error: "Request not authorized" });
                } else {
                    next();
                }
            }
        );
    } else {
        next();
    }
}