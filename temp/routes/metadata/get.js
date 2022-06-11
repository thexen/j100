//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const fs                = require('fs');
const { ErrorCodes }    = require('../../common/types/ecodes');
const {_getFsFilePath}  = require('./utils/fs')

const {CONFIG}          = require('../../config/config')

var _get = async function( _req, _res){

    let stream = undefined;
    try {
        let filePath = await _getFsFilePath( CONFIG.repository.path, _req.params.cid );

        _res.setHeader('Content-Type', 'application/json')
        
        stream = fs.createReadStream(filePath);
        await stream.pipe(_res);
  
    } catch(e) {
  
      reason = e.message.replace( /\"/g, "'" );
      if (e.code == undefined ){
        code = ErrorCodes.UTIL_GENAUTH
      } else {
        code = e.code
      }
  
    } finally {
        stream = undefined;
    }
  

}

module.exports.get = _get;