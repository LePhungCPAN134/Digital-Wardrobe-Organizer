const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all outfits');
});

router.post('/', (req, res) => {
  res.send('Add a outfit');
});

router.delete('/:id', (req, res) => {
  res.send(`Delete outfit with ID ${req.params.id}`);
});

module.exports = router;