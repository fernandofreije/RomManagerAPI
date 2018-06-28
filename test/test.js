const session = require('supertest-session');
const shell = require('shelljs');
const server = require('../server');
const User = require('../models/User');
const Rom = require('../models/Rom');
const romTests = require('./romtest');

const testSession = session(server);

describe('Testing API', () => {
  before(done => {
    const newUser = new User({
      user: 'admin',
      email: 'admin@retro.com',
      password: 'admin.pass',
      admin: true
    });
    newUser.save()
      .then(() => done());
  });

  after(done => {
    User.remove({}).then(() => {
      shell.rm('-rf', `${global.basedir}/uploads/roms/`);
      Rom.remove({ }).then(() => {
        done();
      });
    });
  });

  it('should fail accessing main page', done => {
    testSession.get('/roms')
      .expect(403)
      .end(done);
  });

  it('should sign in as admin', done => {
    testSession.post('/login')
      .send({ login: 'admin', password: 'admin.pass' })
      .expect(200)
      .end(done);
  });

  it('should be able to create a user', done => {
    testSession.post('/users')
      .send({ user: 'testuser', email: 'testemail@ey', password: 'test.pass' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(done);
  });

  romTests();

  it('should be able to see users', done => {
    testSession.get('/users')
      .send({ login: 'admin', password: 'admin.pass' })
      .expect('Content-Type', /json/)
      .expect(response => {
        if (response.body.length !== 2) throw new Error('Not all users returned');
      })
      .expect(200)
      .end(done);
  });
});

