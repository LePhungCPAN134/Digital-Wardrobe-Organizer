const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all clothing');
});

router.post('/', (req, res) => {
  res.send('Add a clothing');
});

router.delete('/:id', (req, res) => {
  res.send(`Delete clothing with ID ${req.params.id}`);
});

module.exports = router;