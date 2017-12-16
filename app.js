var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');//cookie
var bodyParser = require('body-parser');//解析body字段模块
var mongoose = require('mongoose')
import config from './config';//默认配置文件
mongoose.Promise = global.Promise

mongoose.connect(config.database)

var app = express();
var router = express.Router()//路由

import morgan from 'morgan';//命令行log显示
import passport from 'passport';//非常流行的权限验证库, 用户认证模块passport
require('./utils/passport')(passport)//验证方法

//初始化passport模块
app.use(passport.initialize());

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.send(200);
	} else {
	    next();
	}
});

// view engine setup 设置模版
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


//命令行中显示程序运行日志，便于bug调试
app.use(morgan('dev'))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//调用bodyParser模块以便程序正确解析body传入值
//在用post提交数据时需要把参数extended:false改为extended:true，否则会报错。
//为啥会报错呢，因为通常post内容的格式为application/x-www-form-urlencoded，
//因此要用下面的方式来使用：app.use(require('body-parser').unlencoded({extended:true}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由
require('./routes/index')(app)

//监听
app.listen(9090);

module.exports = app;

