module.exports = function(req, res){

    const user = req.body.user.trim();
    const email = req.body.email;

    const errors = [];

    const validateEmail = require("email-validator");

    if (!validateEmail.validate(email)){
        errors.push("Invalid email");
    }
    if (!/^[A-Za-z\s]+$/.test(user) || user.length > 50 || user.length < 5){
        errors.push("Invalid user name");
    }

    if (errors.length === 0){

        const apiKey = require('crypto').randomBytes(20).toString('hex');

        const connection = require('../lib/connection');

        connection.query(
            "INSERT INTO User (Name, Email, ApiKey) VALUES (?, ?, ?)",
            [user, email, apiKey],
            function (error, results, fields){
                if (!error && Number.isInteger(parseInt(results.insertId))){

                    res.cookie('id', results.insertId, { signed: true, httpOnly: false });
                    res.cookie('auth', apiKey, { signed: true, httpOnly: false });

                    res.json({ status: 200, type: 'success', message: "Registration successful" });
                } else {
                    res.json({ status: 406, type: 'error', message: error.sqlMessage });
                }
            }
        );
    } else {
        res.json({status: 406, type: 'error', message: errors});
    }
}