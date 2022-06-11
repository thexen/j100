//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

var _getFsPath = async function( _repository, _cid ) {
    return _repository
      + ( _repository.lastIndexOf('/') == (_repository.length -1) ? '' : '/' ) 
      + _cid.substr( 0, 2 ) + '/'
      + _cid.substr( 2, 2 );
}

var _getFsFilePath = async function( _repository, _cid ) {
  return await _getFsPath( _repository, _cid ) + '/' + _cid;
}

module.exports._getFsPath     = _getFsPath;
module.exports._getFsFilePath = _getFsFilePath;