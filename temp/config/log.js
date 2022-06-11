//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const logConf = new Configuration(  __dirname + '/../conf.d/log.json');
//const logConf = new Configuration(  '/etc/dplatform/conf.d/log.json' );

function Configuration( jsonPath ) {
    return JSON.parse( fs.readFileSync( jsonPath ) );
}

const LOGCONF = logConf.log;

module.exports = {
	LOGCONF,
}
