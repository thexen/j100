//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }    = require('../../common/types/ecodes');

var _dumy = async function( _req, _res ){

    let metadata              = _req.body;

    let reason                = "";
    let code                  = ErrorCodes.OK;
    let bodyData              = "{}";
    let objs                  = undefined;
    
    try {
      
      let strMetadata = JSON.stringify( metadata, null, 2);

      let cid         = 'TODO:CID' 
      let size        = strMetadata.length;

      objs = {
        cid: cid,
        size: size,
      }
      bodyData = JSON.stringify(objs, null, 2);
      
    } catch(e) {
  
      reason = e.message.replace( /\"/g, "'" );
      if (e.code == undefined ){
        console.log( e )
      } else {
        code = e.code
      }
  
    } finally {
  
      _res.statusCode = 200;
      _res.setHeader('Content-Type', 'text/plain');
      _res.end( '{\"code\": ' + code + ',' + '\"reason\": \"' + reason + '\",'+ '\"data\": ' + bodyData + '}' );
  
      objs            = undefined;
      bodyData        = undefined;
  
    }
}


module.exports.dumy = _dumy;