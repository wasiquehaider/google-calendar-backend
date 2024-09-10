const express = require('express');
const router = express.Router();
const {
  listEvents,
  currentDayEvents,
  eventsForDate,
  createEvent,
} = require('../controllers/eventsController');
const { verifyToken } = require('../middlewares/tokenMiddleware');

router.get('/eventList', verifyToken, listEvents);
router.get('/currentDayEvents', verifyToken, currentDayEvents);
router.get('/eventListForDate', verifyToken, eventsForDate);
router.post('/createEvent', verifyToken, createEvent);

module.exports = router;
