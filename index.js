const helmet = require('helmet');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.disable('x-powered-by');

app.use(helmet());
app.use(express.json());
app.use(cookieParser(require('./lib/secret')));
app.use(require('./middlewares/auth'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/tests.html'));
app.post('/', require('./handlers/erase'));
app.post('/users', require('./handlers/users'));
app.post('/currencies', require('./handlers/currency'));
app.post('/transactions', require('./handlers/transaction'));
app.get('/transactions', require('./handlers/history'));
app.get('/transactions/:id/status', require('./handlers/status'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
