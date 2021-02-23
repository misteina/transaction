// This is the route handler that shows the status of a transaction.

module.exports = function (req, res) {

    const transactionId = req.params.id;

    if (Number.isInteger(parseInt(transactionId))) {

        const connection = require('../lib/connection');

        connection.query(
            "SELECT State FROM Transaction WHERE id = ?",
            [transactionId],
            function (error, results) {
                if (!error && results.length === 1) {
                    res.json({ status: 200, type: 'success', message: results[0]['State'] });
                } else {
                    res.json({ status: 406, type: 'error', message: (error !== null)? error.sqlMessage : "Request failed" });
                }
            }
        );
    } else {
        res.json({ status: 406, type: 'error', message: "invalid query" });
    }
}