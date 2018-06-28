const express = require('express');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *  name: Session
 *  description: Operations related to login and session
 */
const sessionRoutes = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     description: Creates user session
 *     tags: [Session]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: Username or email to use for login.
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *       401:
 *         description: wrong login
 */
sessionRoutes.post('/login', (req, res) => {
  User.authenticate(req.body.login, req.body.password, (error, user) => {
    if (error) {
      return res.status(401).json(error);
    } else if (user) {
      req.session.userId = user.id;
      req.session.admin = user.admin;
      return res.status(200).json({ user, message: 'Login sucessfull' });
    }
    return res.status(401).json({ message: 'Not able to authenticate' });
  });
});

/**
 * @swagger
 * /register:
 *   post:
 *     description: Creates a new normal user account in the application
 *     tags: [Session]
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
 */
sessionRoutes.post('/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.admin = false;
  newUser.save()
    .then(user => res.status(200).json({ user: user.toDTO() }))
    .catch(error => res.status(400).send(error));
});

/**
 * @swagger
 * /changeData:
 *   post:
 *     description: Updates user own data
 *     tags: [Session]
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
 *         description: updated user
 *         schema:
 *           type: object
 *           $ref: '#/definitions/User'
 *       400:
 *         description: wrong update
 *       403:
 *         description: not authorized
 */
sessionRoutes.put('/changeData', (req, res) => {
  if (req.session.userId) {
    User.findByIdAndUpdate(req.session.userId, req.body, { new: true })
      .then(user => res.status(200).json({ user: user.toDTO() }))
      .catch(error => res.status(400).json(error));
  } else {
    res.status(403).json('Needs authentication');
  }
});


/**
 * @swagger
 * /logout:
 *   get:
 *     description: Destroys user session
 *     tags: [Session]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: correct logout
 */
sessionRoutes.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logout' });
});

module.exports = sessionRoutes;
