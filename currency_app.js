var express = require('express');

var routes = require('./routes/index');  // home page
var about = require('./routes/about');  // about page

var path = require('path');

var app = express();

/* This tells the server where to look for views and which engine to use. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// and tell it where our static resources (eg stylesheets or images) live
app.use(express.static(path.join(__dirname, "static")));

/* And this is what we want the server to do once it fires up the listener */
app.listen(3010, function() {
	console.log("Currency app listening on port 3010");
});

app.use('/', routes);  // home page
app.use('/about', about);  // about page

module.exports = app;
