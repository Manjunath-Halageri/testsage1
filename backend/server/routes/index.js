'use strict';


const releaseCreateRoutes = require('./releaseCreateRoutes');
const dashboardLineGraphSearchRoutes = require('./dashboardLineGraphSearchRoutes');
function init(server) {

  server.use('*', function (req, res, next) {
    console.log(' Request was made to: ' + req.originalUrl);
    return next();
  });
  
 
  server.use('/release', releaseCreateRoutes);
  server.use('/dashboard', dashboardLineGraphSearchRoutes);

}

module.exports = {
  init: init
};