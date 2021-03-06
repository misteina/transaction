module.exports = function (req, res, next){

    // This is the middleware that authenticates and authorizes user requests.
    // This will not be implemented this way in a real world production application.
    // JSON Web Tokens is a better way to implement authentication in production.

    const checkRoutes = ['currencies', 'transactions'];

    const path = req.path.split('/')[1];

    if (checkRoutes.includes(path)) {

        const userId = req.signedCookies.id;
        const apiKey = req.signedCookies.auth;

        const connection = require('../lib/connection');

        if (Number.isInteger(parseInt(userId)) && apiKey.length > 0){
            connection.query(
                "SELECT ApiKey FROM User WHERE id = ?",
                [userId],
                function (error, results) {
                    if (error || results[0].ApiKey !== apiKey) {
                        res.json({ status: 401, type: 'error', message: "Request not authorized(1)" });
                    } else {
                        next();
                    }
                }
            );
        } else {
            res.json({ status: 401, type: 'error', message: "Request not authorized(2)" });
        }        
    } else {
        next();
    }
}