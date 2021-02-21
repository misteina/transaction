module.exports = function (req, res) {

    const bitcoin = req.body.bitcoin;
    const ethereum = req.body.ethereum;
    const userId = req.cookies.id;

    const errors = [];

    if (bitcoin.length === 0 && ethereum.length === 0) {
        res.status(406).json({ error: "Please fill at least one wallet id" });
    }
    if (bitcoin.length > 0 && bitcoin.length !== 36) {
        errors.push("Invalid bitcoin wallet id");
    }
    if (ethereum.length > 0 && ethereum.length !== 36) {
        errors.push("Invalid ethereum wallet id");
    }

    if (errors.length === 0) {

        let params = [bitcoin, ethereum, userId];
        let query = "UPDATE Users SET BitcoinWallet = ?, EthereumWallet = ? WHERE id = ?";

        if (bitcoin.length === 0){
            params = [ethereum, userId];
            query = "UPDATE Users SET EthereumWallet = ?";
        } else if (ethereum.length === 0) {
            params = [bitcoin, userId];
            query = "UPDATE Users SET BitcoinWallet = ?";
        }

        const connection = require('../lib/connection');

        connection.query(
            query,
            params,
            function (error, results, fields) {
                if (!error && results.affectedRows === 1) {
                    res.json({ success: "Wallet Id added successfully" });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );

        connection.end();

    } else {
        res.status(406).json({ error: errors });
    }
}