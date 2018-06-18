const express = require('express');
const thegamesdb = require('thegamesdb');
const Platform = require('../models/Platform');
const Rom = require('../models/Rom');

const scrapperRoutes = express.Router();

scrapperRoutes.route('/gameList').get((req, res) => {
  thegamesdb.getGamesList(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});

scrapperRoutes.route('/game').get((req, res) => {
  thegamesdb.getGame(req.query)
    .then(response => res.status(200).json(Rom.process(response, req.session.userId)))
    .catch(err => res.status(400).json(err));
});

scrapperRoutes.route('/platformList').get((req, res) => {
  thegamesdb.getPlatformsList(req.query)
    .then(response => res.status(200).json(response))
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});

scrapperRoutes.route('/platform').get((req, res) => {
  Platform.findOne(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});


scrapperRoutes.route('/updatePlatformList').get((req, res) => {
  let platformIdList = [];
  thegamesdb.getPlatformsList(req.query)
    .then(listResponse => {
      platformIdList = listResponse.map(x => x.id);
      platformIdList.forEach(x => {
        thegamesdb.getPlatform({ id: x })
          .then(response => {
            Platform.findOneAndUpdate(
              { remoteId: response.id },
              Platform.process(response),
              { upsert: true }
            ).catch(err => {
              console.log(err);
              console.log(response);
            });
          });
      });
      res.status(200).json('Updated platforms');
    })
    .catch(err => res.status(400).json(err));
});


module.exports = scrapperRoutes;
