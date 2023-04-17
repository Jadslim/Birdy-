var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');


//var usersRouter = require('./routes/users');
var routes = require('./routes');

var app = express();

// Fixing CORS Problem
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


var connectDB = require('./connection/db')
connectDB()


app.use(logger('dev'));
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(routes);


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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));