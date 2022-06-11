//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const Redis = require("ioredis")
const { promisify } = require("util");
const config = require('../../../config/globals');
const statics = require('../../../config/statics');
const {REDISCONF} = require('../../../config/chain');

const redisClinet = new Redis({
    sentinels: REDISCONF.sentinel.hosts,
    name:  REDISCONF.sentinel.name,
    sentinelPassword:  REDISCONF.sentinel.pwd,
    password: REDISCONF.pwd
});

const _asyncGet = promisify(redisClinet.get).bind(redisClinet);
const _asyncKeys = promisify(redisClinet.keys).bind(redisClinet);
const _asyncTTL = promisify(redisClinet.ttl).bind(redisClinet);

async function _getFromRedis( _key ) {
	return await _asyncGet( _key );
}

/*
async function _syncInvokeIntoRedis( _key, _value, _param ) {
	if( _param != undefined ){
		let bRes = await redisClinet.set( _key, (typeof _value == 'object') ? JSON.stringify( _value ) : _value );
		if( bRes ){
			return await redisClinet.expire( _key, _param.expire );
		}
		return false; 
	}
	return await redisClinet.set( _key, (typeof _value == 'object') ? JSON.stringify( _value ) : _value );
}
*/

async function _syncInvokeIntoRedis( _key, _value, _param ) {
	if( _param != undefined ){
		return await redisClinet.set( _key, (typeof _value == 'object') ? JSON.stringify( _value ) : _value, 'EX', _param.expire );
	}
	return await redisClinet.set( _key, (typeof _value == 'object') ? JSON.stringify( _value ) : _value );
}

async function _syncExpireFromRedis( _key, _expire ) {
	return await redisClinet.expire( _key, _expire );
}

async function _syncDeleteFromRedis( _key ) {
	return await redisClinet.del( _key );
}

async function _syncQueryFromRedis( _dslQuery ) {

	if( _dslQuery == undefined){
		throw Error( 'Requered DSLQuery' );
	}

	let methods = Object.keys( _dslQuery );
	if( methods.length != 1 ){
		throw Error( 'Method must one in DSLQuery' );
	}
	let key = _dslQuery[ methods[0] ].key;
	if( key == undefined ){
		throw Error( 'Requered key' );
	}	

	let ret = {};
	try{	
		if( methods[0] == 'keys' ){
			ret['keys'] = await _asyncKeys( key );
			if( ret.keys == undefined || ret.keys.length == 0 ){
				return undefined;
			}
			return JSON.stringify( ret );
		} else if ( methods[0] == 'get' ){
			return await _asyncGet( key );
		} else if ( methods[0] == 'ttl' ){
			ret['ttl'] = await _asyncTTL( key );
			return JSON.stringify( ret );
		} else if ( methods[0] == 'cache' ){
			let value = _dslQuery[ methods[0] ].value;
			if( value == undefined ){
				throw Error( 'Requered value' );
			}
			/*
			let tempKey	= statics._prefixTempKey + key;
			let bRes 	= await redisClinet.set( tempKey, (typeof value == 'object') ? JSON.stringify( value ) : value );
			value 		= undefined;

			let expire = _dslQuery[ methods[0] ].expire;
			if( expire == undefined || expire > config._expireTempMax ){
				expire = config._expireTempMax;
			}
			if( bRes ){
				await redisClinet.expire( tempKey, expire );
			}
			*/
			let expire = _dslQuery[ methods[0] ].expire;
			if( expire == undefined || expire > config._expireTempMax ){
				expire = config._expireTempMax;
			}

			let tempKey	= statics._prefixTempKey + key;
			await redisClinet.set( tempKey, (typeof value == 'object') ? JSON.stringify( value ) : value, 'EX',expire );
			value 		= undefined;

			ret = {
				key: key,
				expire: expire
			}
			return ret;
		} else if ( methods[0] == 'purge' ){
			let tempKey	= statics._prefixTempKey + key;
			let res 	= await redisClinet.del( tempKey );
			ret = {
				purge: res
			}
			return ret;
		} else if ( methods[0] == 'pop' ){
			let tempKey	= statics._prefixTempKey + key;
			ret = await _asyncGet( tempKey );
			if( ret != undefined ){
				await redisClinet.del( tempKey );
			}
			return ret;
		} else if ( methods[0] == 'del' ){
			let res = await redisClinet.del( key );
			ret = {
				del: res
			}
			return ret;
		}
		throw Error( 'DSLQuery Method is not define' );		
	} finally {
		methods 	= undefined;
		ret 		= undefined;
	}

}

module.exports.GetFromRedis 		= _getFromRedis;
module.exports.SyncInvokeIntoRedis 	= _syncInvokeIntoRedis;
module.exports.SyncDeleteFromRedis 	= _syncDeleteFromRedis;
module.exports.SyncExpireFromRedis 	= _syncExpireFromRedis;
module.exports.SyncQueryFromRedis 	= _syncQueryFromRedis;
