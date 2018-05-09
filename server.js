var express = require('express');
var session = require('express-session')
var errorHandler = require('express-json-errors');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var config = require('./config/DB');
var docRoutes = require('./routes/docRoutes')
var userRoutes = require('./routes/userRoutes')
var romRoutes = require('./routes/romRoutes')
var sessionRoutes = require('./routes/sessionRoutes')
var morgan = require('morgan')

var port = process.env.PORT || 8080; // set our port

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('Can not connect to the database' + err)
    }
);

app.use(bodyParser.urlencoded({
    extended: true
}));
app
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use(errorHandler())

app.use(session({
    secret: '@lavidaesdura@',
    resave: true,
    saveUninitialized: false
  }));

function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      res.status(401).send({error:'Needs authentication'})
    }
  }

function requiresAdmin(req, res, next) {
    if (req.session && req.session.userId && req.session.admin) {
      return next();
    } else {
      res.status(401).send({error:'Needs authentication'})
    }
  }

app.use('/users', requiresAdmin , userRoutes)
app.use('/roms/', requiresLogin ,romRoutes)
app.use('/', sessionRoutes)
app.use('/', docRoutes)

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);