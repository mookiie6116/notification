const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale('th');

router.use('/notify',require('./api_notify'))

module.exports = router;