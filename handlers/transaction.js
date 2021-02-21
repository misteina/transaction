module.exports = function (req, res){
    
    const amount = req.body.amount;
    const currency = req.body.currency;
    const target = req.body.target;
    const source = req.signedCookies.id;

    const errors = [];

    if (!Number.isInteger(parseInt(userId))){
        errors.push("Invalid user id");
    }
    if (!Number.isInteger(parseInt(amount))){
        errors.push("Invalid amount selected");
    }
    if (currency !== 'Bitcoin' && currency !== 'Ethereum'){
        errors.push("Invalid currency selected");
    }
    if (!Number.isInteger(parseInt(source))){
        errors.push("Invalid sender");
    }
    if (!Number.isInteger(parseInt(target))) {
        errors.push("Invalid receiver");
    }

    if (errors.length === 0){

        const connection = require('../lib/connection');

        connection.query(
            "SELECT MaxAmount FROM Users WHERE id = ?",
            [userId],
            function (error, results, fields){
                if (!error){
                    if (results.length === 1){
                        
                        if (amount <= results[0].MaxAmount){
                            connection.query(
                                "INSERT INTO Transactions (Amount, Currency, Source, Target) VALUES (?, ?, ?, ?)",
                                [amount, currency, source, target],
                                function (error, results, fields) {
                                    if (!error && !isNaN(results.insertId)) {

                                        const addToQueue = require('../queue/job');

                                        let params = [connection, results.insertId, amount, currency, source, target];

                                        addToQueue(params);

                                        res.json({success: `Transaction successfully submitted with ID ${results.insertId}`});

                                    } else {
                                        res.status(406).json({ error: error });
                                    }
                                }
                            );
                        } else {
                            res.status(406).json({ error: "Maximum amount per transaction exceeded" });
                        }
                    } else {
                        res.status(406).json({ error: error });
                    }
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );
    } else {
        res.status(406).json({ error: errors });
    }
}