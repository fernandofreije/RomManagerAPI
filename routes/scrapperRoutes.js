const express = require('express');
const thegamesdb = require('thegamesdb');

const scrapperRoutes = express.Router();

scrapperRoutes.route('/gameList').get((req, res) => {
  console.log(req.query);
  thegamesdb.getGamesList(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});

module.exports = scrapperRoutes;
