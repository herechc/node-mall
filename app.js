var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');//cookie
var bodyParser = require('body-parser');//解析body字段模块
var mongoose = require('mongoose')
import config from './config';//默认配置文件
mongoose.Promise = global.Promise

mongoose.connect(config.database)

import morgan from 'morgan';//命令行log显示

import passport from 'passport';//用户认证模块
require('./utils/passport')(passport)//验证方法

var app = express();
var router = express.Router()//路由
// view engine setup 设置模版
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//初始化passport模块
app.use(passport.initialize());
//命令行中显示程序运行日志，便于bug调试
app.use(morgan('dev'))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 调用bodyParser模块以便程序正确解析body传入值
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由
require('./routes/index')(app)

//监听
app.listen(3000);

module.exports = app;

