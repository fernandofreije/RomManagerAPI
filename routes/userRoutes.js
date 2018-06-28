const express = require('express');
const shell = require('shelljs');

/**
 * @swagger
 * tags:
 *  - name: Users
 *    description: Operations related to users
 */


/**
 * @swagger
 * definitions:
 *   User:
 *       tags: Users
 *       type: object
 *       required:
 *         - email
 *       properties:
 *          email:
 *            type: string
 */
const User = require('../models/User');

const Rom = require('../models/Rom');

const userRoutes = express.Router();


userRoutes.route('/').post((req, res) => {
  const newUser = new User(req.body);
  newUser.save()
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).send(error));
});

/**
   * @swagger
   * users/:
   *   get:
   *     tags: [Users]
   *     description: Returns users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/User'
   */
userRoutes.route('/').get((req, res) => {
  User.find()
    .then(users => res.status(200).json(users.map(x => x.toDTO())))
    .catch(error => res.status(400).json(error));
});


userRoutes.route('/:id').get((req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).json(error));
});

userRoutes.route('/:id').put((req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).json(error));
});

// Defined delete | remove | destroy route
userRoutes.route('/:id').delete((req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      const path = `${global.basedir}/uploads/roms/${user.id}`;
      if (shell.test('-e', path)) shell.rm('-r', path);
      res.status(200).json({ user: user.toDTO() });
      Rom.remove({ user: user.id });
    })
    .catch(error => res.status(400).json(error));
});

module.exports = userRoutes;
