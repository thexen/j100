//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const fs = require('fs');
const chainConf = new Configuration(  __dirname + '/../conf.d/chains.dev.json');
//const chainConf = new Configuration(  '/etc/dplatform/conf.d/chains.json' );

function Configuration( jsonPath ) {
    return JSON.parse( fs.readFileSync( jsonPath ) );
}

const MONGODBCONF = chainConf.mongodb;
const REDISCONF = chainConf.redis;
const ESCONF = chainConf.elasticsearch;
const QUORUMCONF = chainConf.quorum; 

module.exports = {
  MONGODBCONF,
  REDISCONF,
  QUORUMCONF,
  ESCONF,
}
