/**
 * This project is written in ES6
 * 
 * @author Huang Songlin
 */

 // If using ES5, please write `let mysql = require('mysql')`
import mysql from 'mysql';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import loginRouter from './login';
import loginRouter from './login';
import courseRouter from './course';
import forumRouter from './forum';
import messageRouter from './message';
import newsRouter from './news';
import settingRouter from './setting';
import sourceRouter from './source';
import sectionRouter from './section';
import fileRouter from './file';
import assignmentRouter from './assignment';
import dashboardRouter from './dashboard';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Create Connection to MySql Server
let connection = mysql.createConnection({
  host: 'localhost',
  root: 3306,
  user: 'root',
  password: 'Huang010521',
  database: 'Moodle',
})
connection.connect((err)=>{
  if (err) {
    console.log("Error: "+err.message);
  }
  else {
    console.log("Successfully Connect to MySQL server");
  }
})

// Add the connection to requset object
app.use((req,res,next)=>{
  req.sql = connection;
  next();
})

// Handle login request
app.use('/login', loginRouter);

// Generate the user name, id, and other information need for later construcion
app.use((req,res,next)=>{
  if (req.cookies.uid.isEmpty()){
    res.json({
      status:false,
      error: 'Unauthorized Access'
    });
  }
  req.sql.query(`SELECT identity,name FROM user WHERE user_id = ${req.cookies.uid};`, (err, results, fields)=>{
    if (err){
      console.log(err.message);
    }
    else {
      if (results.length === 0) {
        res.json({
          status:false,
          error: 'Unauthorized Access'
        });
      }
      else if (results[0].identity == 'instructor') {
        req.identity = 'instructor';
        req.name = results[0].name;
        res.cookie('uid',req.cookies.uid,{maxAge:300000})
      }
      else if (result[0].identity == 'participator'){
        req.identity = 'participator';
        req.name = results[0].name;
        res.cookie('uid',req.cookies.uid,{maxAge:300000})
      }
    }
  })
  next();
})

app.use('/course', courseRouter);
app.use('/forum', forumRouter);
app.use('/message', messageRouter);
app.use('/news', newsRouter);
app,use('/setting', settingRouter);
app.use('/source', sourceRouter);
app.use('/section',sectionRouter);
app.use('/file',fileRouter);
app.use('/assignment',assignmentRouter);
app.use('/dashboard', dashboardRouter);

// Add file system here!

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
