const express = require('express');
const router = express.Router();
const { listEvents, createEvent } = require('../controllers/eventsController');
const { verifyToken } = require('../middlewares/tokenMiddleware');

router.get('/eventList', verifyToken, listEvents);
router.post('/createEvent', verifyToken, createEvent);

module.exports = router;
