// config.js
const env = process.env.NODE_ENV;

const common = {
  app: {
    port: 8080
  },
  whitelistedOrigins: [
    'http://localhost:3000',
    'https://retroemulator.netlify.com',
    'http://retroemulator.netlify.com'
  ]
};


const production = {
  db: {
    host: 'heroku_gtck55gp:odgdkfcuicimbid65gmudjonjo@ds121311.mlab.com',
    port: 21311,
    name: 'heroku_gtck55gp'
  },
  logStyle: 'combined'
};

const dev = {
  db: {
    host: 'localhost',
    port: 27017,
    name: 'rommanager'
  },
  logStyle: 'dev'
};

const test = {
  db: {
    host: 'localhost',
    port: 27017,
    name: 'rommanager_test'
  }
};

const config = {
  production,
  dev,
  test
};
module.exports = Object.assign({}, common, config[env]);
