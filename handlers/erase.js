const { response } = require('express');

// This is the route handler that clears the database before running tests.

module.exports = function(req, res){

    const connection = require('../lib/connection');

    connection.query("TRUNCATE TABLE User", function () {
        connection.query("TRUNCATE TABLE Transaction", function () {
            res.json({status: 200, type: 'success', message: 'done'});
        });
    });
}