require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var validator = require('express-validator');


// var indexRouter = require('./routes/index');
var api = require('./routes/api');

var app = express();
app.use(cors());
app.use(validator());

mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/SalamTradeVersion`,{useNewUrlParser : true}).then(
  (res) =>{
    console.log("Connected to Database Seccessfully...");
  }
).catch((e)=>{
  console.log("Connection to database failed...",e);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({ limit : '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
