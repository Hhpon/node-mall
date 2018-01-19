var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
 var mongoose =require("mongoose");
var logger = require('morgan');
var cookieParser = require('cookie-parser');//中间件
var bodyParser = require('body-parser');
//引入ejs.js
var  ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var admin = require('./routes/admin');

var app = express();

//更改html需要安装 npm i ejs --save 然后引入 ejs配置下面代码
app.engine('.html',ejs.__express)
app.set('view engine', 'html');
/**/

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//使用可访问目录
app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
//登录拦截
app.use(function(req, res, next){
	//获取cookie
	if(req.cookies.userId||req.cookies.adminId){
		next()
	}else{
		/*
		path: '/main', //不带参数
  		baseUrl: '/r1/r2',
  		originalUrl: '/r1/r2/main?p1=123&p2=456', //带参数
  		url: '/main?p1=123&p2=456'
		 */
		
		if(req.path=='/admin/imglist'||req.originalUrl=='/admin/login'||req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.path=='/goods/list'||req.path=='/goods/lists'||req.path=='/users/Signup'){
			next()
		}else{
			// next()
			res.json({
				status:'10001',
				msg:"违法操作",
				result:""
			})
		}
	}
})
//定义路由
app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);
app.use('/admin', admin);
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
 //链接mongo数据库
mongoose.connect("mongodb://127.0.0.1:27017/db_demo")
//链接成功connected
 mongoose.connection.on("connected",function (argument) {
 	console.log("连接数据库成功")
 })
 //链接失败error
 mongoose.connection.on("error",function (argument) {
 	console.log("连接数据库失败")
 })
 //链接断开disconnected
 mongoose.connection.on("disconnected",function (argument) {
 	console.log("连接数据库中断")
 })
module.exports = app;
