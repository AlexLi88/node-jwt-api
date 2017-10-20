const router = require('express').Router();
const api = require('./api')
const config = require('../config')
const apiPath = `/api/${config.api.version}`
router.use(apiPath, api);

module.exports = router;