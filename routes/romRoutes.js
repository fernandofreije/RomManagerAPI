const express = require('express');
const fs = require('fs');
const sanitize = require('sanitize-filename');
const Rom = require('../models/Rom');

const romRoutes = express.Router();

romRoutes.route('/').post((req, res) => {
  const newRom = new Rom(req.body);
  newRom.user = req.session.userId;
  newRom.save()
    .then(rom => {
      res.status(200).json({ message: `Rom ${rom.title} added successfully` });
    })
    .catch(error => res.status(400).send(error));
});

romRoutes.route('/').get((req, res) => {
  Rom.find({ user: req.session.userId })
    .then(roms => res.status(200).json(roms))
    .catch(error => res.status(400).json(error));
});

romRoutes.route('/:id').get((req, res) => {
  Rom.find({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).json(rom))
    .catch(error => res.status(400).json(error));
});

romRoutes.route('/:id/file').get((req, res) => {
  Rom.find({
    id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).sendFile(rom.file))
    .catch(error => res.status(400).json(error));
});

//  Defined update router
romRoutes.route('/:id').put((req, res) => {
  Rom.findAndModify({
    _id: req.params.id,
    user: req.session.userId
  }, req.body)
    .then(rom => res.status(200).json({ message: `Successfully updated rom ${rom.title}` }))
    .catch(error => res.status(400).json(error));
});

// Defined delete | remove | destroy route
romRoutes.route('/:id').delete((req, res) => {
  Rom.findAndRemove({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).json({ message: `Successfully removed rom ${rom.title}` }))
    .catch(error => res.status(400).json(error));
});

romRoutes.route('/upload').post((req, res) => {
  if (!req.files) res.status(400).send('No files were uploaded.');
  else {
    const userdir = `${global.basedir}/uploads/roms/${req.session.userId}/`;
    const { romFile } = req.files;
    const [fileName, extension] = romFile.name.split('.')
      .map(x => sanitize(x.replace(' ', '_')));
    const timestamp = Date.now() / 1000;

    if (!fs.existsSync(userdir)) fs.mkdirSync(userdir);
    const fileUrl = `${userdir}/${fileName}_${timestamp}.${extension}`;
    romFile.mv(fileUrl)
      .then(file => res.json({ file }))
      .catch(error => res.status(400).json(error));
  }
});

module.exports = romRoutes;
