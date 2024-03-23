let routing = require('../config/routes');

exports.doAuthentication = function(req,res,next){
	console.log("Authentication passed");
	return next();
}

