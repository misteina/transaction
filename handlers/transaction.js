// This is the route handler that receives a transaction request from a user and 
// dispatches the request to the job queue located in PROJECT_DIRECTORY/queue/job.js

module.exports = function (req, res){

    // Input fields
    
    const amount = req.body.amount;
    const currency = req.body.currency;
    const target = req.body.target;
    const source = req.signedCookies.id;

    const errors = [];

    // Validate inputs

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

        let walletType = (currency === 'Bitcoin') ? 'BitcoinWallet' : 'EthereumWallet';

        connection.query(
            `SELECT MaxAmount, ${walletType} FROM User WHERE id = ?`,
            [source],
            function (error, results, fields){
                if (!error){
                    if (results.length === 1 && results[0][walletType] != null){

                        // Ensures that the amount is within the limits of the 
                        // maximum amount per transaction.
                        
                        if (amount <= results[0].MaxAmount){
                            connection.query(
                                "INSERT INTO Transaction (Amount, Currency, Source, Target) VALUES (?, ?, ?, ?)",
                                [amount, currency, source, target],
                                function (error, results, fields) {
                                    if (!error && Number.isInteger(parseInt(results.insertId))) {

                                        const addToQueue = require('../queue/job');

                                        let currencyType = (currency === 'Bitcoin')? 'BitcoinBalance' : 'EthereumBalance';

                                        let params = [connection, results.insertId, amount, currencyType, source, target];

                                        // Adds transaction to queue to be processed at the background
                                        // in parallel

                                        addToQueue(params);

                                        res.json({status: 200, type: 'success', message: `Transaction successfully submitted with ID ${results.insertId}`});

                                    } else {
                                        res.json({ status: 406, type: 'error', error: (error !== null) ? error.sqlMessage : "Request failed" });
                                    }
                                }
                            );
                        } else {
                            res.json({ status: 406, type: 'error', error: "Maximum amount per transaction exceeded" });
                        }
                    } else if (results[0][walletType] === null) {
                        res.json({ status: 406, type: 'error', error: `You do not have a ${currency} wallet` });
                    } else {
                        res.json({ status: 406, type: 'error', error: (error !== null) ? error.sqlMessage : "Request failed" });
                    }
                } else {
                    res.json({ status: 406, type: 'error', error: (error !== null) ? error.sqlMessage : "Request failed" });
                }
            }
        );
    } else {
        res.json({ status: 406, type: 'error', error: errors });
    }
}