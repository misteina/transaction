const axios = require('axios');
const connection = require('../lib/connection');

let id = null;
let auth = null;

beforeAll(() => {
    connection.query("TRUNCATE TABLE User", function () {
        connection.query("TRUNCATE TABLE Transaction", function () {
            connection.end();
        });
    });
});

test('Add first user', async () => {
    const response = await axios({
        url: 'http://localhost:3000/users',
        method: 'post',
        data: { user: 'James Kenaan', email: 'james@xyz.com' }
    });
    if (typeof response.headers['id'] !== 'undefined' && typeof response.headers['auth'] !== 'undefined') {
        id = response.headers['id'];
        auth = response.headers['auth'];
    }
    expect(response.data).toHaveProperty('success');
});

test('Add second user', async () => {
    const response = await axios({
        url: 'http://localhost:3000/users',
        method: 'post',
        data: { user: 'David Burrow', email: 'david@xyz.com' }
    });
    expect(response.data).toHaveProperty('success');
});

test('Add Currency account', async () => {
    const response = await axios({
        url: 'http://localhost:3000/currencies',
        method: 'post',
        headers: {'Cookie': `id=${id}; auth=${auth}`},
        data: { bitcoin: '8a15ne4d-3d6c-6745-d282-da885h64pqf9' }
    });
    expect(response.data).toHaveProperty('success');
});
