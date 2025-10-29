const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Get all users');
});

router.post('/', (req, res) => {
  res.send('Add a user');
});

router.delete('/:id', (req, res) => {
  res.send(`Delete user with ID ${req.params.id}`);
});

module.exports = router;