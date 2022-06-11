var route_loader = {};

var routerConf = require('../config/router');

route_loader.init = function(app, router) {
	console.log('called route_loader.init.');
	return initRoutes(app, router);
};

function initRoutes(app, router) {

	var infoLen = routerConf.route_info.length;
	console.log('number of routers : %d', infoLen);

	for (var i = 0; i < infoLen; i++) {
		var curItem = routerConf.route_info[i];

		var curModule = require(curItem.file);
		if (curItem.type === 'get') {
            router.route(curItem.path).get(curModule[curItem.method]);
		} else if (curItem.type === 'post') {
            router.route(curItem.path).post(curModule[curItem.method]);
		} else if (curItem.type === 'put') {
			router.route(curItem.path).put(curModule[curItem.method]);
		} else if (curItem.type === 'delete') {
			router.route(curItem.path).delete(curModule[curItem.method]);
		} else {
			router.route(curItem.path).post(curModule[curItem.method]);
		}
		console.log('set route file: %s, method: %s ', curItem.file, curItem.method);
	}
    app.use('/', router);
}

module.exports = route_loader;
