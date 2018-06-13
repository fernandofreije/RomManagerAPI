const express = require('express');
const User = require('../models/User');

const sessionRoutes = express.Router();

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

sessionRoutes.post('/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.admin = false;

  newUser.save()
    .then(user => res.status(200).json({ message: `User ${user.email} registered successfully` }))
    .catch(error => res.status(400).send(error));
});

sessionRoutes.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy()
      .then(res.status(200).json({ message: 'Logout' }))
      .catch(error => res.status(400).send(error));
  }
});

module.exports = sessionRoutes;
