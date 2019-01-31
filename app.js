var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var passport = require('passport');
var config = require("./config")
var authenticate = require('./authenticate');

const nodemailer = require('nodemailer');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useMongoClient: true,
    /* other options */
  });

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });



var index = require('./routes/index');
var users = require('./routes/users');
var contact = require('./routes/contact');
var products = require('./routes/products');
var users = require("./routes/users");
var orders = require("./routes/orders");
var productOrder = require("./routes/productOrder");
var sendEmail = require("./routes/sendEmail");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded( {limit: '50mb', extended: true}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static("public"))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/contacts', contact);
app.use('/orders', orders);
app.use('/products', products);
app.use('/productOrder', productOrder);
app.use("/users" , users);
app.use("/sendEmail" , sendEmail);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
module.exports = app;
