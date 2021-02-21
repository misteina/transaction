module.exports = function (req, res, next){

    // This is the middleware that authenticates and authorizes user requests.
    // This will not be implemented this way in a real world production application.
    // JSON Web Tokens is the ideal way to implement this in production.

    const checkRoutes = ['/currencies', '/transactions'];

    for (let route of checkRoutes){
        if (req.path.startsWith(route)){

            const userId = req.cookies.id;
            const apiKey = req.cookies.apiKey;

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

            break;
        }
    }
    
    next();
}