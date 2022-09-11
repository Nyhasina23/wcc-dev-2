require('./config/dbConfig');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

//cors
const cors = require('cors');

//MIDDLEWARE
app.use(cors({ origin:"*"}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}));

//ROUTES
const exchange = require('./routes/exchange.routes');
const user = require('./routes/user.routes');
app.use('/user', user);
app.use('/exchange', exchange);

const path = require('path');
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/*', (req,res)=> res.status(404).send('This route does not exist'));

module.exports = app;