var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbUrl = 'mongodb://127.0.0.1:27017/mall'
mongoose.connect(dbUrl)

var app = express();
var router = express.Router()
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
 res.send('Hello World!')
  console.log(1)
})

require('./routes/index')(app)

app.listen(3000);

module.exports = app;

