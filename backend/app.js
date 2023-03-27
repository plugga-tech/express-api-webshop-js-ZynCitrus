var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('././routes/api');

var app = express();

const MongoClient = require("mongodb").MongoClient;
MongoClient.connect("mongodb+srv://sebastianpost:CPWNyr8xJ5Qm7ZhY@cluster0.okp4lug.mongodb.net/?retryWrites=true&w=majority")
.then(client => {
    console.log("Ansluten till DB");

    const db = client.db("users");
    app.locals.db = db;
})
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

module.exports = app;
