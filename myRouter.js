const express = require('express');
const router = express.Router();

// Визначаємо home-router
router.get('/', (req, res) => {
  res.send('It is main router');
});

// Визначаємо router "about"
router.get('/about', (req, res) => {
  res.send('It is about-router');
});
module.exports = router;
