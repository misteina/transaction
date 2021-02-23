// This is the route handler that adds a new user.

module.exports = function(req, res){

    const user = req.body.user.trim();
    const email = req.body.email;

    const errors = [];

    const validateEmail = require("email-validator");

    // Validate user details

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

                    res.cookie('id', results.insertId, { signed: true });
                    res.cookie('auth', apiKey, { signed: true });

                    res.json({ status: 200, type: 'success', message: `Registration successful with user ID ${results.insertId}` });
                } else {
                    res.json({ status: 406, type: 'error', message: (error !== null) ? error.sqlMessage : "Request failed" });
                }
            }
        );
    } else {
        res.json({status: 406, type: 'error', message: errors});
    }
}