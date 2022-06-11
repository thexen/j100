//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes } = require('../../config/ecodes');
const statics = require('../../config/statics');
const config = require('../../config/globals');
var ipRangeCheck = require("ip-range-check");
var url = require('url');
const { SyncInvokeIntoChain, GetFromChain } = require('../chains/caller');
const { HMAC256HEX } = require('../utils/crypto/hmac');

var _authorizationTokenize = async function ( _authValue ){

	let aKeyDocument 	= undefined;
	let valueJson		= undefined;
	
	try{

		let [authMethod, aKey, sKey] = await _GetAuthorizationTokenize( _authValue );
		
		let accessKey 		= statics._prefixAccessKey + aKey;
		aKeyDocument 		= await GetFromChain( 'redis', undefined, accessKey );

		if( aKeyDocument == undefined ){
			//TODO
			let idx = aKey.indexOf( '#' );
			if( idx == 0 ){
				//등록된 partner인지 ES에서 조회하여 REDIS에 Cache 한다.
				let did = aKey.substring(1);
				valueJson = await GetFromChain( 'mongo', 'wallets', did );
				if( valueJson == undefined ){
					throw { message: "Not found document - Requered D'Auth",  }
				} 
				aKeyDocument 						= valueJson.akey;
				aKeyDocument['created_time']		= new Date().toISOString();
				aKeyDocument['extradata'] 			= valueJson.extradata;
				aKeyDocument.restrictions.user.role = valueJson.did.role;
				aKeyDocument.restrictions.user.key 	= valueJson.did.key;

				//agency 등록
				if( aKeyDocument.restrictions.user.role == 'ISSUER' || aKeyDocument.restrictions.user.role == 'VERIFIER' ){
					if( aKeyDocument.restrictions.agency == undefined && aKeyDocument.restrictions.agency.did == undefined ){
						throw Error( "ISSUER or VERIFIER must have an agency set up - Requered D'Auth" );
					}
					valueJson = await GetFromChain( 'mongo', 'wallets', aKeyDocument.restrictions.agency.did );
					if( valueJson == undefined ){
						throw Error( "Not found document - Requered D'Auth" );
					}
					aKeyDocument.restrictions.agency = {
						did : aKeyDocument.restrictions.agency.did,
						key: valueJson.did.key
					}
					//aKeyDocument.restrictions.agency["key"] = valueJson.did.key
				}
				valueJson = undefined;
				//Invoke
				await SyncInvokeIntoChain( 'redis', undefined, accessKey, JSON.stringify( aKeyDocument ), undefined );
			} else {
				throw Error( "Not found document - Requered D'Auth" );
			}
		}
		return [ authMethod, aKey, sKey, aKeyDocument ];
	} catch( e ) {
		throw Error( e.message ); 
	} finally {
		//release memory( c++ style )
		aKeyDocument	= undefined;
		valueJson		= undefined;
	}
}

/*
	//_accessor.ip: 사용자의 remote ip
	//_accessor.api: 호출된 REST API 이름
	//_permission: 호출한 사용자에게 허가된 접근 권한
*/
var _checkPermission = async function ( _accessor, _permission ){

	let ret 		= false;
	let sliceClass 	= undefined;
	try {
		while( true ){
			//Check IP
			if( _permission.ip == undefined || _permission.ip.length == 0 || _permission.ip == "*" ){
			} else {
				let ipRange = _permission.ip.split( ',' );
				let checkIp = ipRangeCheck( _accessor.remoteip, ipRange);
				ipRange = undefined
				if( !checkIp ){
					break;
				}
			}

			//Check API
			if( _accessor.api == undefined ){
				ret = true;
				break;
			}
			if( _permission == undefined || _permission.api == undefined ){
				break;
			}
			if( typeof _permission.api == 'object' ){
				for( var i=0; i<_permission.api.length; i++ ){
					const idx = _accessor.api.indexOf( _permission.api[i]);
					if( idx == 0 ){
						ret = true;
						break;
					}
				}
			} else if( typeof _permission.api == 'string' ){
				if( _permission.api == 'all' || _permission.api == '*' ){
					ret = true;
				} else {
					sliceClass = _permission.api.split(',');
					for( var i=0; i<sliceClass.length; i++ ){
						const idx = _accessor.api.indexOf( sliceClass[i]);
						if( idx == 0 ){
							ret = true;
							break;
						}
					}
				}
			}
			break;
		}
		return ret;
	} finally {
		sliceClass = undefined;
	}
}

var _Basic = async function ( aKey, sKey, aKeyDocument ){
	if( sKey != aKeyDocument.skey ){
		throw Error( "Access key is invalid - Requered D'Auth" );
	}
	return true;
}

var _HMAC = async function ( _req, aKey, sKey, aKeyDocument ){

	let dateValue = _req.headers['x-date'];
	if( dateValue == undefined ){
		throw Error( "Requered Authorization - Requered x-date" );
	}

	let timeNow   = new Date( );
	let timeDate  = new Date( dateValue );
	let urlObj = url.parse( _req.url );

	//300 sec(5분)
	if( timeNow - timeDate > config._validAuthDate ){
		throw Error( "Authorization is invalid - Date is not valid" );
	}

	let stringToSign = "";
	stringToSign +=  urlObj.pathname + "\r\n";
	stringToSign += dateValue + "\r\n";

	let signature = await HMAC256HEX( aKeyDocument.skey, stringToSign );

	if ( sKey != signature ){
		throw Error( "AAuthorization is invalid - Signature is not valid" );
	}

	return true;
}

var _Authorization = async function ( _req, _api ) {

	let authValue = _req.headers['authorization'];
	if( authValue == undefined ){
		throw Error( "Requered Authorization - Requered D'Auth" );
	}

	let authMethod 		= undefined;
	let aKey			= undefined;
	let sKey			= undefined;
	let aKeyDocument	= undefined;
	try{	
		[authMethod, aKey, sKey, aKeyDocument ] = await _authorizationTokenize( authValue );

		if(!await _checkPermission( { remoteip: _req.connection.remoteAddress.replace(/^.*:/, ''), api: _api }, aKeyDocument.restrictions.permission)){
			throw Error( "Permission denied - Requered D'Auth" );
		}

		if( authMethod == statics._authMethodBasic ){
			await _Basic( aKey, sKey, aKeyDocument );
		} else if( authMethod == statics._authMethodHMAC ){
			await _HMAC( _req, aKey, sKey, aKeyDocument );
		}
		return [aKey, sKey, aKeyDocument];
	} catch( e ){
		throw { message: e.message, code: ErrorCodes.AUTHORIZATION }
	} finally {
		authMethod 		= undefined;
		aKey			= undefined;
		sKey			= undefined;
		aKeyDocument	= undefined;
	}

}

var _GetAuthorizationTokenize = async function ( _authValue ) {

	let pairKey 		= undefined;
	let authToken 		= undefined;
	try{	
		let authToken = _authValue.split(' ');
		if( authToken.length !=2 ){
			throw Error( "Authorization is invalid - Requered D'Auth" );
		}

		if( authToken[0] == statics._authMethodBasic ){
			let decodedValue = new Buffer.from( authToken[1], 'base64' ).toString('utf8');
			pairKey = decodedValue.split(':');
			decodedValue = undefined;
		} else if( authToken[0] == statics._authMethodHMAC ){
			pairKey = authToken[1].split(':');
		} else {
			throw Error( "Not supported authorization - Requered D'Auth" );
		}

		if( pairKey.length != 2 ){
			throw Error( "Authorization is invalid - Requered D'Auth" );
		}
		return [ authToken[0], pairKey[0], pairKey[1] ];
	} catch( e ){
		throw { message: e.message, code: ErrorCodes.AUTHORIZATION_TOKENIZE }
	} finally {
		pairKey 	= undefined;
		authToken	= undefined;
	}
}

module.exports.Authorization = _Authorization;
module.exports.GetAuthorizationTokenize = _GetAuthorizationTokenize;

/*
let admin = {
	"created_time": "2021-02-22",
	"skey": "admin",
	"restrictions": {
		"publisher": {
			"did": "NcYxiDXkpYi6ov5FcYDi1e",
			"name": "publish soft",
			"extra": {
			}
		},
		"permission": { 
			"ip": "any",
			"api": "all"//
		},				
		"user": {
			"did": "NcYxiDXkpYi6ov5FcYDi1e"
		}
	}
}

let user = {
	"created_time": "2021-02-22",
	"skey": "user", //Secret key
	"restrictions": {
		"publisher": {},
		"user": {
			"did": "NcYxiDXkpYi6ov5FcYDi1e"
		}
	}
}
*/

//admin:admin ->  Basic YWRtaW46YWRtaW4=
//SET 'accessor/admin' '{"created_time":"2021-02-22","skey":"admin","restrictions":{"publisher":{"did":"NcYxiDXkpYi6ov5FcYDi1e","name":"publish soft","extra":{}},"permission":{"ip":"any","api":"all"},"user":{"did":"NcYxiDXkpYi6ov5FcYDi1e"}}}'

//NcYxiDXkpYi6ov5FcYDi1e:admin ->  Basic I05jWXhpRFhrcFlpNm92NUZjWURpMWU6YWRtaW4=
//SET 'accessor/NcYxiDXkpYi6ov5FcYDi1e' '{"created_time":"2021-02-22","skey":"admin","restrictions":{"publisher":{"did":"NcYxiDXkpYi6ov5FcYDi1e","name":"publish soft","extra":{}},"permission":{"ip":"any","api":"all"},"user":{"did":"NcYxiDXkpYi6ov5FcYDi1e"}}}'


//user:user -> Basic dXNlcjp1c2Vy
//SET 'accessor/user'  '{"created_time":"2021-02-22","skey":"user","restrictions":{"publisher":{},"user":{"did":"NcYxiDXkpYi6ov5FcYDi1e","role": "PROVER"}}}'


//Veirifier
// #NcYxiDXkpYi6ov5FcYDi2e:6NN7kUM4hLg2EGh5qDf4uAFyaTCvXSreXKN1s4XTJL8e >> I05jWXhpRFhrcFlpNm92NUZjWURpMmU6Nk5ON2tVTTRoTGcyRUdoNXFEZjR1QUZ5YVRDdlhTcmVYS04xczRYVEpMOGU=
