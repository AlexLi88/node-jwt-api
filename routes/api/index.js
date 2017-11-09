const router = require('express').Router();

const users = require('./users');
const orders = require('./orders');
const places = require('./places');

router.use('/users', users);
router.use('/orders', orders);
router.use('/places', places);

module.exports = router;