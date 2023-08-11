const express = require('express');
const userRoleController= require('../controllers/userRoleController');
let router = express.Router();

router.get('/getPermissions',userRoleController.getPermissions);

module.exports = router;




