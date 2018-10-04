const constants = require('./constants');
const { Client } = require('pg');

module.exports.register = function (data, callback) {

    const client = new Client(constants.db_infos);
    client.connect();

    const query = {
        text: 'INSERT INTO compte(name, email, pass) VALUES($1, $2, $3)',
        values: data
    };

    client.query(query, callback);
};

module.exports.login = function (data, callback) {

    const client = new Client(constants.db_infos);
    client.connect();

    const query = {
        text: 'SELECT * FROM compte WHERE email = $1 AND pass = $2',
        values: data
    };

    client.query(query, callback);
};
