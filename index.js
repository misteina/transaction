const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.disable('x-powered-by');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser(require('./lib/secret')));
app.use(require('./middlewares/auth'));

app.post('/users', require('./handlers/users'));
app.post('/currencies', require('./handlers/currency'));
app.post('/transactions', require('./handlers/transaction'));
app.get('/transactions', require('./handlers/history'));
app.get('/transactions/:id/status', require('./handlers/status'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
