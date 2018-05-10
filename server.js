const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/DB');
const docRoutes = require('./routes/docRoutes');
const userRoutes = require('./routes/userRoutes');
const romRoutes = require('./routes/romRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080; // set our port

mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(
  () => {
    console.log('Database is connected');
  },
  err => {
    console.log(`Can not connect to the database ${err}`);
  },
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(session({
  secret: '@lavidaesdura@',
  resave: true,
  saveUninitialized: false
}));

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).send({ error: 'Needs authentication' });
}

function requiresAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.admin) {
    return next();
  }
  return res.status(401).send({ error: 'Needs authentication admin' });
}

app.use('/users', requiresAdmin, userRoutes);
app.use('/roms/', requiresLogin, romRoutes);
app.use('/', sessionRoutes);
app.use('/', docRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Magic happens on port ${port}`);
