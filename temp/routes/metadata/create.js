//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const ipfsAPI           = require('ipfs-api');
const fs                = require('fs');
const { ErrorCodes }    = require('../../common/types/ecodes');
const { HttpRequest }   = require('../../common/utils/request/request');
const { _objectToHash } = require('./utils/hash')
const {_getFsPath}      = require('./utils/fs')
const {_providerPaser}  = require('./utils/provider')

const {CONFIG}          = require('../../config/config')

/*
  metadata schema
  {
    name: '',
    description: '',
    image: '',
    edition: '',
    attributes: [],
    issuance: {
      issuer: {
       
      },
      date: '',
      hash: '',
    },
  }

  REQUEST
  {
    metadata: {
      name: '',
      description: '',
      image: '',
      edition: '',
      attributes: [],
    },
    creator: {
      address: '',
    },
    provider: {
      url: ,
      getter: ,
    }

  }
*/

var _saveOnIPFS = async function( _ipfsProvider, _metadata ) {

  let ipfs    = undefined;
  let buf     = undefined;
  let res     = undefined;
  try{
    ipfs    = ipfsAPI( _ipfsProvider.host, _ipfsProvider.port, {protocol: 'https'} );
    buf     = new Buffer.from( JSON.stringify( _metadata, null, 2 ), 'utf-8' );
    res     = await ipfs.files.add( buf );
    if( res.length == 0 ){
     throw 'upload failed.';
    }
    return { cid: res[0].path, size: res[0].size};
  } catch ( e ) {
    throw e
  }finally {

    res   = undefined;
    buf   = undefined;
    ipfs  = undefined;
    
  }

}

var _saveOnLocalFS = async function( _metadata ) {

  let buf     = undefined;
  let stat    = undefined;
  try{

    let cid       = _objectToHash( _metadata );
    let dirPath   =  await _getFsPath( CONFIG.repository.path, cid );

    const isExists = fs.existsSync( dirPath );
    if( !isExists ) {
        fs.mkdirSync( dirPath, { recursive: true } );
    }
    let filePath = dirPath + '/' + cid;

    buf = new Buffer.from( JSON.stringify( _metadata, null, 2 ), 'utf-8' );
    fs.writeFileSync( filePath, buf );
    stat = fs.statSync( filePath );

    return { cid: cid, size: stat.size };

  } catch ( e ) {
    throw e
  }finally {
    stat  = undefined;
    buf   = undefined;
  }
    
}

var _saveWithAPI = async function( _httpProvider, _metadata ) {

  try{
    res = await HttpRequest( 'POST', _httpProvider.url, _metadata)
    if( res.code != 200 ){
      throw res.reason;
    }
    return { cid: res.data.cid, size: res.data.size }
  } catch ( e ) {
    throw e
  }finally {
  }
  
}

var _toSave = async function( _repository, _metadata ) {

  let ret = {
    provider: _repository.provider,
    file: {
    }
  }

  try{

    let res       = {};
    let provider  = await _providerPaser( _repository.provider );

    if ( provider['ipfs'] != undefined ) {

      res = await _saveOnIPFS( provider['ipfs'], _metadata );
      ret.file['protocol']    = provider.protocol;
      ret.file['cid']         = res.cid;
      ret.file['size']        = res.size;
      
    } else if ( provider['http'] != undefined ) {

      res = await _saveWithAPI( provider['http'], _metadata )
      ret.file['protocol']    = provider.protocol;
      ret.file['cid']         = res.cid;
      ret.file['size']        = res.size;

    } else if ( provider['file'] != undefined ) {

      res = await _saveOnLocalFS( _metadata );
      ret.file['protocol']    = provider.protocol;
      ret.file['cid']         = res.cid;
      ret.file['size']        = res.size;

    }

    if ( _repository.provider.getter.length > 0 ) {
      ret.file['getter']  = _repository.provider.getter
                        + (_repository.provider.getter.lastIndexOf('/') == (_repository.provider.getter.length -1) ? '' : '/' ) 
                        + ret.file['cid'];
    }

    res = undefined;

    return ret;

  } catch( e ) {
    throw e;
  } finally {
    ret = undefined;
  }
  
}

//let validCID = 'QmbUny2r6fUccYuvvrdtPJoriRzHxGmt5EqSHEudfBBM7d'   << 한개만 가져옴
//let validCID = 'QmWCoPLF4Xn6UsUvfzi84NwqmJAJCoMfJvZjK5Zx6kUtqv'   << 폴더 , 여러개의 파일 리스트를 가져 옴 / 폴더 업로드로 구성이 가능
var _getFromIPFS  = async function( _repository, _cid ) {

  let [proto, host, port ] = await _providerPaser( _repository.provider );
  if ( proto == 'ipfs' ) {
    if( port == undefined ){
      port = 5001;
    }
    let ipfs    = ipfsAPI(host, port, {protocol: 'https'})
    let files = await ipfs.files.get( _cid );
    files.forEach( (file) => {
      console.log( file );
      //console.log(file.content.toString() )
    })
  }
  
}

var _create = async function( _req, _res){

  let metadata              = _req.body.metadata;
  let creator               = _req.body.creator;
  let repository            = _req.body.repository;

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
  
  try {
    console.log( _req.Auth )

    metadata['issuance'] = {
      creator: creator,
      date: (new Date()).toISOString()
    }
    metadata['issuance']['hash'] = _objectToHash( metadata );

    //To Save
    var res = await _toSave( repository, metadata );

    objs = {
      metadata:   metadata,
      repository: res
    };

    bodyData = JSON.stringify(objs, null, 2);

  } catch(e) {

    reason = e.message.replace( /\"/g, "'" );
    if (e.code == undefined ){
      //TODO
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
    metadata        = undefined;
    repository      = undefined;

  }

}

module.exports.create = _create;