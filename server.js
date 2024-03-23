var restify = require('restify');
var setting = require('./settings');
// const LOGGER = require('bunyan');
const MORGAN = require('morgan');
var routes = require('./config/routes');
var middleware = require('./middleware/middleware');




let server;

server = restify.createServer();
server.use(MORGAN('dev'));
server.use(restify.plugins.bodyParser());
server.listen(setting.webPort, function(req,res,next) {
  console.log('%s listening at %s', server.name, server.url);
});

// server.use(middleware.doAuthentication);

routes.do_routing(server);

