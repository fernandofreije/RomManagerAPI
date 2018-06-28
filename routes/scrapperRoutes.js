const express = require('express');
const thegamesdb = require('thegamesdb');
const Platform = require('../models/Platform');
const Rom = require('../models/Rom');

const scrapperRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  name: ScrapData
 *  description: Operations related to getting data from the internet
 */

/**
 * @swagger
 * definitions:
 *   Platform:
 *       type: object
 *       required:
 *         - remoteId
 *         - name
 *       properties:
 *          remoteId:
 *            type: string
 *          name:
 *            type: string
 *          controller:
 *            type: string
 *          overview:
 *            type: string
 *          developer:
 *            type: string
 *          publisher:
 *            type: string
 *          manufacturer:
 *            type: string
 *          cpu:
 *            type: string
 *          memory:
 *            type: string
 *          graphics:
 *            type: string
 *          sound:
 *            type: string
 *          display:
 *            type: string
 *          media:
 *            type: string
 *          maxControllers:
 *            type: number
 *          rating:
 *            type: number
 *          consoleArt:
 *            type: string
 *          controllerArt:
 *            type: string
 *          images:
 *            type: array
 *            items:
 *              type: string
 */

/**
   * @swagger
   * /scrap/gameList:
   *   get:
   *     tags: [ScrapData]
   *     description: Returns a list of games that contain the name specified
   *     produces:
   *      - application/json
   *     parameters:
   *      - name: name
   *        description: name to search for
   *        required: true
   *        in: query
   *        type: String
   *     responses:
   *       200:
   *         description: returned list of different rom datas
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Rom'
   *       400:
   *         description: error retrieving data
   *       403:
   *         description: not authorized
   */
scrapperRoutes.route('/gameList').get((req, res) => {
  thegamesdb.getGamesList(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});


/**
   * @swagger
   * /scrap/game:
   *   get:
   *     tags: [ScrapData]
   *     description: Returns a specific data of a specific game
   *     produces:
   *      - application/json
   *     parameters:
   *      - name: gameId
   *        description: id from thegamesdb of the game
   *        required: true
   *        in: query
   *        type: String
   *     responses:
   *       200:
   *         description: return game data of specific game
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Rom'
   *       400:
   *         description: error retrieving data
   *       403:
   *         description: not authorized
   */
scrapperRoutes.route('/game').get((req, res) => {
  thegamesdb.getGame(req.query)
    .then(response => res.status(200).json(Rom.process(response, req.session.userId)))
    .catch(err => res.status(400).json(err));
});


/**
   * @swagger
   * /scrap/platformList:
   *   get:
   *     tags: [ScrapData]
   *     description: Returns a list of all the platforms in thegamedb
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: returned list of all platforms
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Platform'
   *       400:
   *         description: error retrieving data
   *       403:
   *         description: not authorized
   */
scrapperRoutes.route('/platformList').get((req, res) => {
  thegamesdb.getPlatformsList(req.query)
    .then(response => res.status(200).json(response))
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});

/**
   * @swagger
   * /scrap/platform:
   *   get:
   *     tags: [ScrapData]
   *     description: Returns a specific data of a specific platform
   *     produces:
   *      - application/json
   *     parameters:
   *      - name: platformId
   *        description: id from thegamesdb of the platform
   *        required: true
   *        in: query
   *        type: String
   *     responses:
   *       200:
   *         description: return data for a specific platform
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Platform'
   *       400:
   *         description: error retrieving data
   *       403:
   *         description: not authorized
   */
scrapperRoutes.route('/platform').get((req, res) => {
  Platform.findOne(req.query)
    .then(response => res.status(200).json(response))
    .catch(err => res.status(400).json(err));
});

module.exports = scrapperRoutes;
