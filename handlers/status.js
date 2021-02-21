module.exports = function (req, res) {

    const transactionId = req.params.id;

    if (!Number.isInteger(parseInt(transactionId))) {
        res.status(406).json({ error: "invalid query" });
    } else {

        const connection = require('../lib/connection');

        connection.query(
            "SELECT State FROM Transaction WHERE id = ?",
            [transactionId],
            function (error, results) {
                if (!error && results.length === 1) {
                    res.json({ data: results[0]['State'] });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );
    }
}