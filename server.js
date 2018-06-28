const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');
const docRoutes = require('./routes/docRoutes');
const userRoutes = require('./routes/userRoutes');
const romRoutes = require('./routes/romRoutes');
const scrapperRoutes = require('./routes/scrapperRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const uuid = require('uuid/v4');
const cors = require('cors');

global.basedir = __dirname;

const app = express();
const port = process.env.PORT || 8080; // set our port

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`).then(
  () => {
    console.log('Database is connected');
  },
  err => {
    console.log(`Can not connect to the database ${err}`);
  },
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

if (process.env.NODE_ENV !== 'test') app.use(morgan(config.logStyle));

app.use(session({
  genid: () => uuid(),
  secret: '@lavidaesdura@',
  resave: true,
  saveUninitialized: false
}));

app.use(cors({
  origin(origin, callback) {
    if (config.whitelistedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(403).send({ error: 'Needs authentication' });
}

function requiresAdmin(req, res, next) {
  if (req.session && req.session.userId && req.session.admin) {
    return next();
  }
  return res.status(403).send({ error: 'Needs authentication admin' });
}

app.use('/users', requiresAdmin, userRoutes);
app.use('/roms/', requiresLogin, romRoutes);
app.use('/scrap/', requiresLogin, scrapperRoutes);
app.use('/', sessionRoutes);
app.use('/', docRoutes);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Magic happens on port ${port}`);

module.exports = app;

