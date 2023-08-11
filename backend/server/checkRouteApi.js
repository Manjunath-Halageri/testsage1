
const express = require('express');
const checkRouteConnection = require('./checkRouteConnection');
let router =  express.Router();

router.get('/iAmCallingUisngRouter',checkRouteConnection.iAmCallingUisngRouter);

module.exports = router;