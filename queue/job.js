// This is the job queue module which processes transaction requests.
// It was implemented using bull https://www.npmjs.com/package/bull#documentation

module.exports = async function addToQueue(params) {

    const [ connection, transactionId, amount, currency, source, target ] = params;

    const winston = require('winston');

    // Configure file logger

    const logger = winston.createLogger({
        transports: [
            new winston.transports.File({ filename: './log/transaction.log' })
        ]
    });

    const Queue = require('bull');
    const queue = new Queue('transactions');

    queue.process(async (job) => {

        // To process a transfer safely between users, the queries will have to be wrapped in
        // a database transaction to ensure that we roll back any previously made queries 
        // in a situation where something goes wrong and all the queries required to 
        // make a transfer couldn't get completed.

        connection.beginTransaction(
            function (error){
                if (error) { throw error; }
                connection.query(

                    // Ensure that the sender has adequate balance and substract specified 
                    // amount

                    `UPDATE User SET ${currency} = ${currency} - ? WHERE id = ? AND ${currency} >= ?`,
                    [amount, source, amount],
                    function (error, results){
                        if (!error && results.affectedRows === 1){
                            let wallet = (currency === 'BitcoinBalance')? 'BitcoinWallet' : 'EthereumWallet';
                            connection.query(

                                // Verify the receiver has currency type and add substracted amount 
                                // from sender to receiver

                                `UPDATE User SET ${currency} = ${currency} + ? WHERE id = ? AND ${wallet} != ?`,
                                [amount, target, 'NULL'],
                                function (error, results) {
                                    if (!error && results.affectedRows === 1) {
                                        connection.query(

                                            // Update transaction state

                                            "UPDATE Transaction SET State = 'Success', Processed = NOW() WHERE id = ?",
                                            [job.data.id],
                                            function (error, results){
                                                if (!error && results.affectedRows === 1){
                                                    connection.commit(function (err) {
                                                        if (err) {
                                                            return connection.rollback(() => {
                                                                failedTransaction('error', `Transaction ID #${job.data.id} failed with ${err}`)
                                                            });
                                                        }

                                                        // Log outcome to file located at PROJECT_DIRECTORY/log/transaction.log

                                                        logger.log('info', `Transaction ID #${job.data.id} completed successfuly`);
                                                    });
                                                } else {
                                                    return connection.rollback(() => {
                                                        failedTransaction('error', `Transaction ID #${job.data.id} failed with ${error}`)
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        return connection.rollback(() => {
                                            failedTransaction('error', `Transaction ID #${job.data.id} failed with ${error}`)
                                        });
                                    }
                                }
                            );
                        } else {
                            return connection.rollback(() => {
                                failedTransaction('error', `Transaction ID #${job.data.id} failed with error ${error}`)
                            });
                        }
                    }
                );
            }
        );
    });

    // Add job queue

    queue.add({ id: transactionId });

    // The failedTransaction() function runs if something went wrong and the transaction 
    // couldn't be completed. The status of the transaction request will be updated to 'Failed' 
    // and an error logged to file.

    function failedTransaction(level, msg){
        connection.query("UPDATE Transaction SET State = ? WHERE id = ?", ['Failed', transactionId]);
        logger.log(level, msg);
    }

}