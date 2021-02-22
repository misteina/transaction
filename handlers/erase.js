const { response } = require('express');

module.exports = function(req, res){

    const connection = require('../lib/connection');

    connection.query("TRUNCATE TABLE User", function () {
        connection.query("TRUNCATE TABLE Transaction", function () {
            //connection.end();
            res.json({status: 200, type: 'success', message: 'done'});
        });
    });
}