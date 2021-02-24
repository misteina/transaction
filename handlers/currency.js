// This is the route handler to add transaction currency in Bitcoin or Ethereum

module.exports = function (req, res) {

    const bitcoin = req.body.bitcoin || "";
    const ethereum = req.body.ethereum || "";
    const userId = req.signedCookies.id;

    const errors = [];

    // From my little research it seems the bitcoin and Ethereum wallet id takes the format like:
    // 8a15ne4d-3d6c-6745-d282-da885h64pqf9
    // Therefore the validation regex will be structured like:
    // /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/

    const walletFormat = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

    if (!Number.isInteger(parseInt(userId))){
        errors.push("Invalid user ID");
    }
    if (bitcoin.length === 0 && ethereum.length === 0) {
        res.json({ status: 406, type: 'error', error: "Please fill at least one wallet id" });
    }
    if (bitcoin.length > 0 && !walletFormat.test(bitcoin)) {
        errors.push("Invalid Bitcoin wallet id");
    }
    if (ethereum.length > 0 && !walletFormat.test(ethereum)) {
        errors.push("Invalid Ethereum wallet id");
    }

    if (errors.length === 0) {

        let feedback = `Bitcoin and Ethereum wallet IDs ${bitcoin}, ${ethereum} added successfully`;
        let params = [bitcoin, 100000.00, ethereum, 100000.00, userId];
        let query = "UPDATE User SET BitcoinWallet = ?, BitcoinBalance = ? EthereumWallet = ?, EthereumBalance = ? WHERE id = ?";

        if (bitcoin.length === 0){
            feedback = `Ethereum wallet ID ${ethereum} added successfully`;
            params = [ethereum, 100000.00, userId];
            query = "UPDATE User SET EthereumWallet = ?, EthereumBalance = ? WHERE id = ?";
        } else if (ethereum.length === 0) {
            feedback = `Bitcoin wallet ID ${bitcoin} added successfully`;
            params = [bitcoin, 100000.00, userId];
            query = "UPDATE User SET BitcoinWallet = ?, BitcoinBalance = ? WHERE id = ?";
        }

        const connection = require('../lib/connection');

        connection.query(
            query,
            params,
            function (error, results) {
                if (!error && results.affectedRows === 1) {
                    res.json({ status: 200, type: 'success', message: feedback });
                } else {
                    res.json({ status: 406, type: 'error', message: (error !== null) ? error.sqlMessage : "Request failed" });
                }
            }
        );
    } else {
        res.json({ status: 406, type: 'error', message: errors });
    }
}