module.exports = function (req, res) {

    const userId = req.cookies.id;
    const transactionId = req.params.id;

    if (isNaN(userId) || isNaN(transactionId)) {
        res.status(406).json({ error: "invalid query" });
    } else {

        const connection = require('../lib/connection');

        connection.query(
            "SELECT State FROM Transaction WHERE Source = ?",
            [userId],
            function (error, results, fields) {
                if (!error && results.length === 1) {
                    res.json({ data: results[0]['State'] });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );

        connection.end();
    }
}