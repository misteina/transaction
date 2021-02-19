module.exports = function (req, res) {

    const userId = req.cookies.id;

    if (isNaN(userId)){
        res.status(406).json({error: "invalid user id"});
    } else {

        const connection = require('../lib/connection');

        connection.query(
            "SELECT * FROM Transaction WHERE Source = ? ORDER BY Created ASC LIMIT 10",
            [userId],
            function (error, results, fields){
                if (!error && results.length > 0) {
                    res.json({ data: results });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );

        connection.end();
    }
}