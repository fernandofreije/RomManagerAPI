const session = require('supertest-session');
const server = require('../server');

const test = () => {
  let romTestSession = null;
  let gameId = null;
  let romData = null;
  let savedRomId = null;

  describe('should be able to interact as normal user', () => {
    before(done => {
      romTestSession = session(server);
      done();
    });

    before(done => {
      romTestSession = session(server);
      done();
    });

    it('should fail accessing his roms', done => {
      romTestSession.get('/roms')
        .expect(403)
        .end(done);
    });

    it('should sign in as normal user', done => {
      romTestSession.post('/login')
        .send({ login: 'testuser', password: 'test.pass' })
        .expect(200)
        .end(done);
    });

    it('should be able to access his roms', done => {
      romTestSession.get('/roms')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should be able search rom data', done => {
      romTestSession.get('/scrap/gameList?name=super%mario%bros')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          gameId = response.body[0].id;
          done();
        });
    });

    it('should be able get rom data', done => {
      romTestSession.get(`/scrap/game?id=${gameId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          romData = response.body;
          done();
        });
    });

    it('should be able to upload a rom', done => {
      romTestSession.post('/roms/upload')
        .attach('romFile', 'test/testfile/test.nes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          romData.file = response.body.fileUrl;
          done();
        });
    });


    it('should be able to create a rom', done => {
      romTestSession.post('/roms')
        .send(romData)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, response) => {
          savedRomId = response.body.rom.id;
          done();
        });
    });

    it('should be able to download a rom file', done => {
      romTestSession.get(`/roms/${savedRomId}/download`)
        .send(romData)
        .expect(200)
        .expect('Content-Type', 'application/octet-stream')
        .end(done);
    });

    it('should be able to update a rom', done => {
      romTestSession.put(`/roms/${savedRomId}`)
        .send({ title: 'test' })
        .expect(200)
        .expect(response => {
          if (response.body.rom.title !== 'test') throw new Error('Not updated rom');
        })
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should be able to delete a rom', done => {
      romTestSession.delete(`/roms/${savedRomId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });

    it('should be able to logout', done => {
      romTestSession.get('/logout')
        .expect(200)
        .end(done);
    });

    it('should be able to access roms after logout', done => {
      romTestSession.get('/roms')
        .expect(403)
        .end(done);
    });
  });
};

module.exports = test;
