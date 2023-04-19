var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('././routes/api');

const url = 'mongodb://localhost:8889/userbook';

var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(url)
  .then(client => {
    console.log("Connected to database");

    const db = client.db("users");
    app.locals.db = db;
  })
  .catch(err => {
    console.log(err);
  });
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
