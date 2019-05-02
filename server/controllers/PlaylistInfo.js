import Playlist from '../models/Playlist';

var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
  const playlist = await Playlist.findOne({ where: { id: req.params.id } });
  if (playlist) {
    const users = await playlist.getAttendees();
    res.send({ playlist, users });
    return;
  }
  res.status(401).send({ message: 'Not Found!' });
});

export default router;
