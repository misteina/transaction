// This is the route handler to add transaction currency

module.exports = function (req, res) {

    const bitcoin = req.body.bitcoin || "";
    const ethereum = req.body.ethereum || "";
    const userId = req.signedCookies.id;

    const errors = [];

    // From my little research the bitcoin and Ethereum wallet id takes the format like:
    // 8a15ne4d-3d6c-6745-d282-da885h64pqf9
    // Therefore the validation regex will be structured like:
    // /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/

    const walletFormat = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/;

    if (!Number.isInteger(parseInt(userId))){
        errors.push("Invalid user ID");
    }
    if (bitcoin.length === 0 && ethereum.length === 0) {
        res.status(406).json({ error: "Please fill at least one wallet id" });
    }
    if (bitcoin.length > 0 && !walletFormat.test(bitcoin)) {
        errors.push("Invalid bitcoin wallet id");
    }
    if (ethereum.length > 0 && !walletFormat.test(ethereum)) {
        errors.push("Invalid ethereum wallet id");
    }

    if (errors.length === 0) {

        let params = [bitcoin, ethereum, userId];
        let query = "UPDATE User SET BitcoinWallet = ?, EthereumWallet = ? WHERE id = ?";

        if (bitcoin.length === 0){
            params = [ethereum, userId];
            query = "UPDATE User SET EthereumWallet = ? WHERE id = ?";
        } else if (ethereum.length === 0) {
            params = [bitcoin, userId];
            query = "UPDATE User SET BitcoinWallet = ? WHERE id = ?";
        }

        const connection = require('../lib/connection');

        connection.query(
            query,
            params,
            function (error, results) {
                if (!error && results.affectedRows === 1) {
                    res.json({ status: 200, type: 'success', message: `Wallet Id (${bitcoin}) added successfully` });
                } else {
                    res.json({ status: 406, type: 'error', message: error.sqlMessage });
                }
            }
        );
    } else {
        res.status(406).json({ status: 406, type: 'error', message: errors });
    }
}