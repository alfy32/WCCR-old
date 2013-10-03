'use strict';

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('6deo89i7u7eo9iue09i7de88a7ieq;k'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

function security(req, res, next) {
	if (!req.session.user) {
		res.writeHead(403);
		return res.end();
	}
	next();
}

// -+-+-+-+- Authentication -+-+-+-+-+-+-+-+-+-+-+-+-+-+-

var users = {};

app.post('/signup', function(req, res) {
	if (users[req.body.user]) {
		return res.send({
			success: false,
			err: 'Username is already taken.'
		});
	}

	users[req.body.user] = {
		user: req.body.user,
		pass: req.body.pass
	};

	req.session.user = users[req.body.user];

	res.send({
		success: true,
		user: req.session.user
	});
});

app.post('/login', function(req, res) {
	if (!users[req.body.user]) {
		return res.send({
			success: false,
			err: 'Username does\'t exist.'
		});
	}

	if (users[req.body.user].pass !== req.body.pass) {
		return res.send({
			success: false,
			err: 'Invalid Password.'
		});
	}

	req.session.user = users[req.body.user];

	res.send({
		success: true,
		user: req.session.user
	});
});

app.get('/user', security, function(req, res) {
	res.send({
		success: true,
		user: req.session.user
	});
});

app.post('/logout', function(req, res) {
	req.session.destroy();
	res.send('ok');
});