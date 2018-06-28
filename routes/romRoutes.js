const express = require('express');
const sanitize = require('sanitize-filename');
const Rom = require('../models/Rom');
const shell = require('shelljs');

const romRoutes = express.Router();

romRoutes.route('/').post((req, res) => {
  const newRom = new Rom(req.body);
  newRom.user = req.session.userId;
  newRom.save()
    .then(rom => {
      res.status(200).json({ rom: rom.toDTO() });
    })
    .catch(error => res.status(400).send(error));
});

romRoutes.route('/').get((req, res) => {
  Rom.find({ user: req.session.userId })
    .then(roms => res.status(200).json(roms.map(x => x.toDTO())))
    .catch(error => res.status(400).json(error));
});

romRoutes.route('/:id').get((req, res) => {
  Rom.findOne({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).json({ rom: rom.toDTO() }))
    .catch(error => res.status(400).json(error));
});

romRoutes.route('/:id/file').get((req, res) => {
  Rom.findOne({
    id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).sendFile(rom.file))
    .catch(error => res.status(400).json(error));
});

//  Defined update router
romRoutes.route('/:id').put((req, res) => {
  Rom.findByIdAndUpdate({
    _id: req.params.id,
    user: req.session.userId
  }, req.body, { new: true })
    .then(rom => res.status(200).json({ rom: rom.toDTO() }))
    .catch(error => console.log(error));
});

// Defined delete | remove | destroy route
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

romRoutes.route('/:id/download').get((req, res) => {
  Rom.findOne({
    _id: req.params.id,
    user: req.session.userId
  })
    .then(rom => res.status(200).download(rom.file))
    .catch(error => res.status(400).json(error));
});

module.exports = romRoutes;
