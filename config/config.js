// config.js
const env = process.env.NODE_ENV;

const production = {
  app: {
    port: 8080
  },
  db: {
    host: 'heroku_gtck55gp:odgdkfcuicimbid65gmudjonjo@ds121311.mlab.com',
    port: 21311,
    name: 'heroku_gtck55gp'
  }
};

const dev = {
  app: {
    port: 8080
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'rommanager'
  }
};

const test = {
  app: {
    port: 8080
  },
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
module.exports = config[env];
