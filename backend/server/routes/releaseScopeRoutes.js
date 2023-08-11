const express = require('express');
const releaseScopeController= require('../controllers/releaseScopeController');
let router = express.Router();

router.get('/oldGetModule',releaseScopeController.oldModule);

module.exports = router;