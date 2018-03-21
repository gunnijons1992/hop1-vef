const express = require('express');


const {
  readAll,
  readCategories,
  readOne,
  searchBy,
} = require('./books');


const router = express.Router();

router.get('/books', async (req, res) => {
  if(req.query.search === undefined){
    const rows = await readAll();
    res.json(rows);
  }
  else {
    const query = req.query.search;
    const result = await searchBy(query);
    res.json(result);
  }
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
