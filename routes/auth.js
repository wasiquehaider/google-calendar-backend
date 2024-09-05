const express = require('express');
const router = express.Router();
const { getAuthUrl, oauth2callback } = require('../controllers/authController');

router.get('/auth', getAuthUrl);
router.get('/oauth2callback', oauth2callback);

module.exports = router;
