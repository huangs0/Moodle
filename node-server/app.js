var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

// Initialize the mysql connection here and pass it into the SQL server

var loginRouter = require('./login');
var courseRouter = require('./course');
var forumRouter = require('./forum');
var messageRouter = require('./message');
var newsRouter = require('./news');
var settingRouter = require('./setting');
var sourceRouter = require('./source');
var sectionRouter = require('./section');
var fileRouter = require('./file');
var assignmentRouter = require('./assignment')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Create Connection to MySql Server
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Huang010521',
  database: 'Moodle'
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
    res.end("Unauthorized Access");
  }
  req.sql.query("SELECT identity,name FROM user WHERE `user_id` = "+req.cookies.uid+";", (err, results, fields)=>{
    if (err){
      console.log(err.message);
    }
    else {
      if (results.length === 0) {
        res.end("Unauthorized Access");
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

app.get('/dashboard', (req, res)=>{
  let course;
  var course_return = [];
  req.sql.query('SELECT course FROM user WHERE `user_id` = '+req.cookies.uid+";", (err, results, fields)=>{
    if (err) {
      console.log(err.message);
    }
    else {
      course = JSON.parse(results[0].course);
    }
  })
  for (let i = 0; i < course.length; i++){
    req.sql.query('SELECT course_id, title FROM user WHERE `course_id` = '+course[i]+";", (err, results, fields)=>{
      if (err) {
        console.log(err.message);
      }
      else {
        course_return.push({title:results[0].title, course_id: results[0].course_id});
      }
    })
  }
  res.json({
    name: req.name,
    course: course_return
  });
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
