//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }                                            = require('../../common/types/ecodes');
const { UpsertToMongo, QueryFromMongo }                         = require ( '../../common/chains/mongo/call.js' );

var _findTokens = async function( _req, _res ){

  let query                 = _req.body.query;

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
  
  try {

    objs        = await QueryFromMongo( "tokens", query );
    bodyData    = JSON.stringify( objs, null, 2 );

  } catch(e) {

    reason = e.message.replace( /\"/g, "'" );
    if (e.code == undefined ){
      code = ErrorCodes.UTIL_GENAUTH
    } else {
      code = e.code
    }

  } finally {

    _res.statusCode = 200;
    _res.setHeader('Content-Type', 'text/plain');
    _res.setHeader('CCache-control', 'no-cache');
    _res.end( '{\"code\": ' + code + ',' + '\"reason\": \"' + reason + '\",'+ '\"data\": ' + bodyData + '}' );

    objs            = undefined;
    bodyData        = undefined;

  }
  

}

module.exports.findTokens = _findTokens;