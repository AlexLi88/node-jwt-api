const express = require('express'),
	  path = require('path'),
	  logger = require('morgan'),
	  cookieParser = require('cookie-parser'),
	  bodyParser = require('body-parser'),
	  mongoose = require('mongoose'),
	  passport = require('passport');


const routes = require('./routes'),
	  port = process.env.PORT || 3000,
	  config = require('./config'),
	  app = express();

mongoose.connection.openUri(config.database.local)
  .once('open', () => console.log(`Mongo Server is connected at ${config.database.local}`))
  .on('error', (error) => {
    console.warn('Warning', error);
  });


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
require('./config/passport')(passport)

app.use(routes);

app.use(function(req, res, next){
	var err = new Error('404 Not Found');
	err.status = 404;
	next(err);
});


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

app.listen(port)
console.log("Server is listening on port " + port)