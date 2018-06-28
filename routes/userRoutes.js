const express = require('express');
const shell = require('shelljs');

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Operations related to CRUD users
 */


/**
 * @swagger
 * definitions:
 *   User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *          username:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          admin:
 *            type: boolean
 */
const User = require('../models/User');

const Rom = require('../models/Rom');

const userRoutes = express.Router();

/**
 * @swagger
 * /users/(post):
 *   post:
 *     description: Creates a user
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         required: true
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: created user
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *       400:
 *         description: wrong register
 *       403:
 *         description: not authorized
 */
userRoutes.route('/').post((req, res) => {
  const newUser = new User(req.body);
  newUser.save()
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).send(error));
});

/**
   * @swagger
   * /users/(get):
   *   get:
   *     tags: [Users]
   *     description: Returns users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: returned list of users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/User'
   *       400:
   *         description: error retrieving users
   *       403:
   *         description: not authorized
   */
userRoutes.route('/').get((req, res) => {
  User.find()
    .then(users => res.status(200).json(users.map(x => x.toDTO())))
    .catch(error => res.status(400).json(error));
});

/**
* @swagger
* /users/{userId}/(get):
*   get:
*     description: Returns a particular user whose id is passed as a parameter
*     tags: [Users]
*     produces:
*       - application/json
*     parameters:
*       - name: userId
*         description: id of the user
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: returned user
*         schema:
*           type: object
*           $ref: '#/definitions/User'
*       400:
*         description: user doesn't exist or couldn't be retrieved
*       403:
*         description: not authorized
*/
userRoutes.route('/:id').get((req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).json(error));
});

/**
 * @swagger
 * /users/{userId}/(put):
 *   put:
 *     description: Updates user own data
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: new user data
 *         required: true
 *         in: path
 *         type: String
 *       - name: user
 *         description: new user data
 *         required: true
 *         in: body
 *         type: object
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: updated user
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *       400:
 *         description: wrong update
 *       403:
 *         description: not authorized
 */
userRoutes.route('/:id').put((req, res) => {
  User.findByIdAndUpdate(req.session.userId, req.body, { new: true })
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).json(error));
});

/**
* @swagger
* users/{userId}/(delete):
*   delete:
*     description: Deletes a particular user
*     tags: [Users]
*     produces:
*       - application/json
*     parameters:
*       - name: userId
*         description: id of the user to delete
*         required: true
*         in: path
*         type: String
*     responses:
*       200:
*         description: deleted user data
*         schema:
*           type: object
*           $ref: '#/definitions/User'
*       400:
*         description: user doesn't exist or couldn't be deleted
*       403:
 *        description: not authorized
*/
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
