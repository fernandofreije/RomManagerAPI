var express = require('express');
var userRoutes = express.Router()
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
 *         - 
 *       properties:
 *          email:
 *            type: string
 */
var User = require('../models/User');


userRoutes.route('/').post(function (req, res) {
  var user = new User(req.body);
  user.save()
    .then(user => {
      res.status(200).json({
        'message': `User ${user.email} added successfully`
      });
    })
    .catch(err => {
      console.error(err)
      res.status(400).send("Unable to save to database");
    });
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
userRoutes.route('/').get(function (req, res) {
  User.find(function (err, users) {
    if (err) {
      console.error(err);
    } else {
      res.json(users);
    }
  });
});


userRoutes.route('/:id').get(function (req, res) {
  var id = req.params.id;
  User.findById(id, function (err, user) {
    res.json(user);
  });
});

userRoutes.route('/:id').put(function (req, res) {
  User.findByIdAndUpdate(req.params.id, req.body,
    function (err, user) {
      if (err) res.json(err);
      else res.json(`Successfully updated user ${user.email}`);
    });
});

// Defined delete | remove | destroy route
userRoutes.route('/:id').delete(function (req, res) {
  User.findByIdAndRemove(req.params.id,
    function (err, user) {
      if (err) res.json(err);
      else res.json(`Successfully removed user ${user.email}`);
    });
});

module.exports = userRoutes;