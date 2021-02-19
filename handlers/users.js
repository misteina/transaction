module.exports = function(req, res){

    const email = req.body.email;
    const password = req.body.password;

    const errors = [];

    const validateEmail = require("email-validator");

    if (!validateEmail.validate(email)){
        errors.push("Invalid email");
    }
    if (password.length > 50 || password.length < 5){
        errors.push("Invalid password");
    }

    if (errors.length === 0){

        const hash = require('bcrypt').hashSync(password, 10);

        const connection = require('../lib/connection');

        connection.query(
            "INSERT INTO Users (Email, Password) VALUES (?, ?)",
            [email, password],
            function (error, results, fields){
                if (!error && Number.isInteger(results.insertId)){
                    res.json({ success: "Registration successful" });
                } else {
                    res.status(406).json({ error: "Request failed" });
                }
            }
        );

        connection.end();

    } else {
        res.status(406).json({error: errors});
    }
}