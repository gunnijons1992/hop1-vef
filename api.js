const express = require('express');

const {
  readAll,
  readCategories,
  readOne,
} = require('./books');

const router = express.Router();

router.get('/books', async (req, res) => {
  const rows = await readAll();
  res.json(rows);
});

router.get('/categories', async (req, res) => {
  const rows = await readCategories();
  res.json(rows);
});

router.get('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const rows = await readOne(id);
  res.json(rows);
});

module.exports = router;
