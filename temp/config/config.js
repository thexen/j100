//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const config = new Configuration(  __dirname + '/../conf.d/default.json');
//const config = new Configuration(  '/etc/dplatform/conf.d/default.json' );

function Configuration( jsonPath ) {
    return JSON.parse( fs.readFileSync( jsonPath ) );
}

const CONFIG = config;

module.exports = {
    CONFIG,
}
