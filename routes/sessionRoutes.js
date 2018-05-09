var express = require('express');
var sessionRoutes = express.Router()
var User = require('../models/User');

sessionRoutes.post('/login', function(req, res){
    User.authenticate(req.body.login, req.body.password, function(err, user){
        if (err){
            res.status(400).send(err.message)
        }
        else if (user){
            console.log(user)
            req.session.userId=user.id
            req.session.admin=user.admin?true:false
            res.status(200).json({'message': 'Login sucessfull'});
            }
            else{
                res.status(400).send("Not able to authenticate");
            }
    })
   
})

sessionRoutes.post('/register', function(req, res){
    var user = new User(req.body);
    user.admin=false;
    user.save()
    .then(user => {
      res.status(200).json({
        'message': `User ${user.email} registered successfully`
      });
    })
    .catch(err => {
      console.error(err)
      res.status(400).send("Unable to save to database");
    });
})

sessionRoutes.get('/logout', function(req, res) {
    if (req.session) {
      req.session.destroy(function(err) {
        if(err) {
            res.status(400).send('Could no destroy session')
        } else {
            res.status(200).send('Logout')
        }
      });
    }
  });

module.exports = sessionRoutes;