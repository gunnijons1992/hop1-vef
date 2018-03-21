const express = require('express');

const {
  create,
  readAll,
  readOne,
  update,
  del,
} = require('./books');

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await readAll();
  res.json(rows);
});

module.exports = router;
