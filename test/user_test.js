const session = require('supertest-session');
const shell = require('shelljs');
const server = require('../server');
const User = require('../models/User');
const Rom = require('../models/Rom');

const testSession = session(server);

let createdUserId = null;

describe('Testing users CRUD admin methods', () => {
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
    User.find().then(users => {
      users.forEach(user => {
        user.remove().then(() => {
          const path = `${global.basedir}/uploads/roms/${user.id}`;
          if (shell.test('-e', path)) shell.rm('-rf', path);
          Rom.remove({ user: user.id }).then(() => {
            done();
          });
        });
      });
    });
  });

  it('should fail accessing main page', done => {
    testSession.get('/roms')
      .expect(403)
      .end(done);
  });

  it('should not be able to sign in with wrong credentials', done => {
    testSession.post('/login')
      .send({ login: 'adminbad', password: 'admin.pass' })
      .expect(401)
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
      .end((err, response) => {
        createdUserId = response.body.user.id;
        done();
      });
  });

  it('should be able to see users', done => {
    testSession.get('/users')
      .expect('Content-Type', /json/)
      .expect(response => {
        if (response.body.length !== 2) throw new Error('Not all users returned');
      })
      .expect(200)
      .end(done);
  });

  it('should be able to a particular user', done => {
    testSession.get(`/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(response => {
        if (response.body.user.user !== 'testuser') throw new Error('Not correct user returned');
      })
      .expect(200)
      .end(done);
  });

  it('should be able to update users', done => {
    testSession.put(`/users/${createdUserId}`)
      .send({ email: 'test_email@test.com' })
      .expect('Content-Type', /json/)
      .expect(response => {
        if (response.body.user.email !== 'test_email@test.com') throw new Error('Not updated user');
      })
      .expect(200)
      .end(done);
  });

  it('should be able to delete users', done => {
    testSession.delete(`/users/${createdUserId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(done);
  });

  it('should not be able to see the deleted user', done => {
    testSession.get('/users')
      .expect('Content-Type', /json/)
      .expect(response => {
        if (response.body.length !== 1) throw new Error('Not all users returned');
      })
      .expect(200)
      .end(done);
  });
});

