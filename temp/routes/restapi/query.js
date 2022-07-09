//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }                             = require('../../common/types/ecodes');
const { NewMongoClient, QueryFromMongo }         = require( '../../common/chains/mongo/call.js' );

var _searchQuery = async function( _req, _res ){

  let collection            = _req.body.collection;
  let query                 = _req.body.query;

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
  
  let mongoClient           = undefined;

  try {

    mongoClient = await NewMongoClient();
    objs        = await QueryFromMongo( mongoClient, collection, query );
    console.log( objs.length )
    bodyData    = JSON.stringify( objs, null, 2 );
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

module.exports.searchQuery = _searchQuery;