//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }                             = require('../../common/types/ecodes');
const { NewMongoClient, UpdateFromMongo }        = require( '../../common/chains/mongo/call.js' );

var _updateQuery = async function( _req, _res ){

  let collection            = _req.body.collection;
  let query                 = _req.body.query;
  let update                = _req.body.update;

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
  
  let mongoClient           = undefined;

  try {

    mongoClient = await NewMongoClient();
    objs        = await UpdateFromMongo( mongoClient, collection, query, update );
    bodyData    = JSON.stringify( objs.result, null, 2 );
    mongoClient.close();

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

    mongoClient     = undefined;
    objs            = undefined;
    bodyData        = undefined;

  }

}

module.exports.updateQuery = _updateQuery;