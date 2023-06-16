var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var apiRouter = require('././routes/api');
var app = express();

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';

MongoClient.connect(url)
  .then(client => {
    console.log('Connected to the database');

    const db = client.db('users');
    app.locals.db = db;
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });



 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api', apiRouter);
module.exports = app;