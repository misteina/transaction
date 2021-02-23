// This is the route handler logic that generates the transaction history for a user.

module.exports = function (req, res) {

    const userId = req.signedCookies.id;

    if (Number.isInteger(parseInt(userId))){

        const connection = require('../lib/connection');

        connection.query(
            "SELECT * FROM Transaction WHERE Source = ? OR Target = ? ORDER BY Created ASC LIMIT 10",
            [userId, userId],
            function (error, results) {
                if (!error && results.length > 0) {

                    let rows = [];

                    for (let row of results) {
                        let flow = (userId == row.Source) ?
                            ["Sent", "To", row.Target] :
                            ["Received", "From", row.Source];

                        rows.push(
                            {
                                [flow[0]]: row.Amount,
                                currency: row.Currency,
                                [flow[1]]: [flow[2]],
                                processed: row.Processed,
                                status: row.State
                            }
                        )
                    }
                    res.json({ status: 200, type: 'success', message: rows });
                } else {
                    res.json({ status: 406, type: 'error', message: (error !== null) ? error.sqlMessage : "Request failed" });
                }
            }
        );
    } else {
        res.json({ status: 406, type: 'error', error: "invalid user id" });
    }
}