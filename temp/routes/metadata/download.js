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

var _download = async function( _req, _res){

    try {
        let filePath = await _getFsFilePath( CONFIG.repository.path, _req.params.cid );

        _res.setHeader('Content-Disposition', `attachment; filename=${_req.params.cid}`);
        _res.setHeader('Content-Type', 'application/json')
        _res.sendFile( filePath );
  
    } catch(e) {
  
      reason = e.message.replace( /\"/g, "'" );
      if (e.code == undefined ){
        code = ErrorCodes.UTIL_GENAUTH
      } else {
        code = e.code
      }
  
    } finally {
    }
  

}

module.exports.download = _download;