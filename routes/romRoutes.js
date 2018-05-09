var express = require('express');
var romRoutes = express.Router();

var Rom = require('../models/Rom');

romRoutes.route('/').post(function (req, res) {
    var rom = new Rom(req.body);
    rom.user = req.session.userId
    rom.save()
        .then(rom => {
            res.status(200).json({
                'message': `Rom ${rom.title} added successfully`
            });
        })
        .catch(err => {
            console.error(err)
            res.status(400).send("Unable to save to database");
        });
});

romRoutes.route('/').get(function (req, res) {
    Rom.find({
        'user': req.session.userId
    }, function (err, roms) {
        if (err) {
            console.error(err);
        } else {
            res.json(roms);
        }
    });
});

romRoutes.route('/:id').get(function (req, res) {
    Rom.find({
            _id: req.params.id,
            user: req.session.userId
        },
        function (err, rom) {
            if (err) res.json(err);
            else res.json(rom);
        });
});

//  Defined update router
romRoutes.route('/:id').put(function (req, res) {
    Rom.findAndModify({
        _id: req.params.id,
        user: req.session.userId
    }, req.body, function (err, rom) {
        if (err) res.json(err);
        else res.json(`Successfully removed rom ${rom.title}`);
    });
});

// Defined delete | remove | destroy route
romRoutes.route('/:id').delete(function (req, res) {
    Rom.findAndRemove({
        _id: req.params.id,
        user: req.session.userId
    }, function (err, rom) {
        if (err) res.json(err);
        else res.json(`Successfully removed rom ${rom.title}`);
    });
});

module.exports = romRoutes;