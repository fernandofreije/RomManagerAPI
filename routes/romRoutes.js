const express = require('express');
const sanitize = require('sanitize-filename');
const Rom = require('../models/Rom');
const shell = require('shelljs');

const romRoutes = express.Router();

/**
 * @swagger
 * tags:
 *  name: Roms
 *  description: Operations related to CRUD roms
 */


/**
 * @swagger
 * definitions:
 *   Rom:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *          remoteId:
 *            type: string
 *          title:
 *            type: string
 *          overview:
 *            type: string
 *          boxartFront:
 *            type: string
 *          boxartBack:
 *            type: string
 *          clearLogo:
 *            type: string
 *          screenshots:
 *            type: array
 *            items:
 *              type: string
 *          images:
 *            type: array
 *            items:
 *              type: string
 *          trailer:
 *            type: string
 *          releaseDate:
 *            type: string
 *            format: date
 *          publisher:
 *            type: string
 *          developer:
 *            type: string
 *          ESBR:
 *            type: string
 *          genres:
 *            type: array
 *            items:
 *              type: string
 *          user:
 *            type: object
 *            schema:
 *              $ref: '#/definitions/User'
 *          file:
 *            type: string
 */

/**
 * @swagger
 * /roms/(post):
 *   post:
 *     description: Creates
 *     tags: [Roms]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rom
 *         required: true
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Rom'
 *     responses:
 *       200:
 *         description: created rom
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Rom'
 *       400:
 *         description: couldn't retrieve rom
 *       403:
 *         description: not authorized
 */
romRoutes.route('/').post((req, res) => {
  const newRom = new Rom(req.body);
  newRom.user = req.session.userId;
  newRom.save()
    .then(rom => {
      res.status(200).json({ rom: rom.toDTO() });
    })
    .catch(error => res.status(400).send(error));
});

/**
   * @swagger
   * /roms/(get):
   *   get:
   *     tags: [Roms]
   *     description: Returns all roms of a user
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: returned list of roms
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/Rom'
   *       400:
   *         description: error retrieving rom
   *       403:
   *         description: not authorized
   */
romRoutes.route('/').get((req, res) => {
  Rom.find({ user: req.session.userId })
    .then(roms => res.status(200).json(roms.map(x => x.toDTO())))
    .catch(error => res.status(400).json(error));
});

/**
* @swagger
* /rom/{romId}/(get):
*   get:
*     description: Returns a particular rom of a user. The rom's id is passed as a parameter
*     tags: [Roms]
*     produces:
*       - application/json
*     parameters:
*       - name: romId
*         description: id of the rom
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: returned rom
*         schema:
*           type: object
*           $ref: '#/definitions/Rom'
*       400:
*         description: rom doesn't exist or couldn't be retrieved
*       403:
*         description: not authorized
*/
romRoutes.route('/:id').get((req, res) => {
  Rom.findOne({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).json({ rom: rom.toDTO() }))
    .catch(error => res.status(400).json(error));
});

/**
* @swagger
* /rom/{romId}/file:
*   get:
*     description: Returns a the server url of the file of a particular
*     tags: [Roms]
*     produces:
*       - application/json
*     parameters:
*       - name: romId
*         description: id of the rom
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: url of file
*         schema:
*           type: string
*       400:
*         description: rom doesn't exist or couldn't be retrieved
*       403:
*         description: not authorized
*/
romRoutes.route('/:id/file').get((req, res) => {
  Rom.findOne({
    id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).sendFile(rom.file))
    .catch(error => res.status(400).json(error));
});

/**
 * @swagger
 * /roms/{romId}/(put):
 *   put:
 *     description: Updates user rom data
 *     tags: [Roms]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: romId
 *         description: new rom data
 *         required: true
 *         in: path
 *         type: String
 *       - name: rom
 *         description: new rom data
 *         required: true
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Rom'
 *     responses:
 *       200:
 *         description: updated rom data
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Rom'
 *       400:
 *         description: wrong update
 *       403:
 *         description: not authorized
 */
romRoutes.route('/:id').put((req, res) => {
  Rom.findByIdAndUpdate({
    _id: req.params.id,
    user: req.session.userId
  }, req.body, { new: true })
    .then(rom => res.status(200).json({ rom: rom.toDTO() }))
    .catch(error => console.log(error));
});

/**
* @swagger
* roms/{romId}/(delete):
*   delete:
*     description: Deletes a particular rom of a user
*     tags: [Roms]
*     produces:
*       - application/json
*     parameters:
*       - name: romId
*         description: id of the rom to delete
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: deleted rp, data
*         schema:
*           type: object
*           $ref: '#/definitions/Rom'
*       400:
*         description: rom doesn't exist or couldn't be deleted
*       403:
 *        description: not authorized
*/
romRoutes.route('/:id').delete((req, res) => {
  Rom.findByIdAndRemove({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => {
      if (shell.test('-e', rom.file)) shell.rm(rom.file);
      res.status(200).json({ rom: rom.toDTO() });
    })
    .catch(error => res.status(400).json(error));
});

/**
 * @swagger
 * /roms/upload:
 *   post:
 *     description: Uploads a rom file to the server
 *     tags: [Roms]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: romFile
 *         required: true
 *         in: body
 *         type: binary
 *     responses:
 *       200:
 *         description: url of the file
 *         schema:
 *           type: string
 *       400:
 *         description: couldn't upload rom
 *       403:
 *         description: not authorized
 */
romRoutes.route('/upload').post((req, res) => {
  if (!req.files) res.status(400).send('No files were uploaded.');
  else {
    const userdir = `${global.basedir}/uploads/roms/${req.session.userId}/`;
    const { romFile } = req.files;
    const extension = sanitize(romFile.name.split('.').pop());
    const fileName = sanitize(romFile.name.replace(`.${extension}`, '')).replace(' ', '_');
    const timestamp = Date.now() / 1000;

    shell.mkdir('-p', userdir);
    const fileUrl = `${userdir}/${fileName}_${timestamp}.${extension}`;
    romFile.mv(fileUrl)
      .then(() => res.json({ fileUrl }))
      .catch(error => res.status(400).json(error));
  }
});

/**
* @swagger
* /rom/{romId}/download:
*   get:
*     description: Generates a download for the rom file of a rom
*     tags: [Roms]
*     produces:
*       - application/octet-stream
*     parameters:
*       - name: romId
*         description: id of the rom
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: download of the file
*       400:
*         description: rom file doesn't exist or couldn't be retrieved
*       403:
*         description: not authorized
*/
romRoutes.route('/:id/download').get((req, res) => {
  Rom.findOne({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).download(rom.file))
    .catch(error => res.status(400).json(error));
});

module.exports = romRoutes;
