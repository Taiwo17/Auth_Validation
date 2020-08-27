const express = require('express');
const  router = express.Router()

// Login Page
router.get('/', (req, res) => res.render('welcome'))


module.exports = router;