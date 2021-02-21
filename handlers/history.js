module.exports = function (req, res) {

    const userId = req.cookies.id;

    if (isNaN(userId)){
        res.status(406).json({error: "invalid user id"});
    } else {

        const connection = require('../lib/connection');

        connection.query(
            "SELECT * FROM Transaction WHERE Source = ? OR Target = ? ORDER BY Created ASC LIMIT 10",
            [userId, userId],
            function (error, results, fields){
                if (!error && results.length > 0) {

                    let rows = [];

                    for (let row of results){
                        let flow = (userId === row.Source)? 
                            ["Sent", "To", row.Target] : 
                            ["Received", "From", row.Source];

                        rows.push(
                            {
                                [flow[0]]: row.Amount,
                                currency: row.Currency,
                                [flow[1]]: [flow[2]],
                                processed: row.Processed
                            }
                        )
                    }
                    res.json({ data: rows });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );

        connection.end();
    }
}