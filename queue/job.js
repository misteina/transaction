module.exports = async function addToQueue(params) {

    const [ connection, transactionId, amount, currency, source, target ] = params;

    const winston = require('winston');
    winston.add(winston.transports.File, { filename: '../log/transaction.log' });

    const Queue = require('bull');
    const queue = new Queue('transactions');

    queue.process(async (job) => {

        connection.beginTransaction(
            function (error){
                if (error) { throw error; }
                connection.query(
                    `UPDATE Users SET ${currency} = ${currency} - ? WHERE id = ? AND ${currency} >= ?`,
                    [amount, source, amount],
                    function (error, results){
                        if (!error && results.affectedRows === 1){
                            connection.query(
                                `UPDATE Users SET ${currency} = ${currency} + ? WHERE id = ?`,
                                [amount, target],
                                function (error, results) {
                                    if (!error && results.affectedRows === 1) {
                                        connection.query(
                                            "UPDATE Transaction SET State = 'Success', Processed = NOW() WHERE id = ?",
                                            [job.data.id],
                                            function (error, results){
                                                if (!error && results.affectedRows === 1){
                                                    connection.commit(function (err) {
                                                        if (err) {
                                                            return connection.rollback(function () {
                                                                winston.log('error', `Transaction id #${job.data.id} failed(1)`);
                                                            });
                                                        }
                                                        winston.log('info', `Transaction id #${job.data.id} completed successfuly`);

                                                        connection.end();
                                                    });
                                                } else {
                                                    return connection.rollback(function () {
                                                        winston.log('error', `Transaction id #${job.data.id} failed(2)`);
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        return connection.rollback(function () {
                                            winston.log('error', `Transaction id #${job.data.id} failed(3)`);
                                        });
                                    }
                                }
                            );
                        } else {
                            return connection.rollback(function () {
                                winston.log('error', `Transaction id #${job.data.id} failed(4)`);
                            });
                        }
                    }
                );
            }
        );
    });

    queue.add({ id: transactionId });

}