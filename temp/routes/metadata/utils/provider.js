//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////

var _ipfsProvider = async function( _uri ){

  let arr0 =  _uri.split(':');
  if( arr0.length == 2 ) {
    return { host: arr0[0], port: arr0[1]};
  } else if( arr0.length == 1 ) {
    return { host: arr0[0], port: 5001 };
  }
  throw 'Iprovider url is invalid';

}

var _providerPaser = async function( _provider ) {

  let arr0      = undefined;
  let ret       = {};

  try{
    if( _provider != undefined && _provider.url != undefined ) {
      arr0 = _provider.url.split('://');
      if( arr0.length == 2 ) {

        protocol = arr0[0]
        if( protocol == 'ipfs' ){
          ret['ipfs'] = await _ipfsProvider( arr0[1] );
        } else if( protocol == 'http' || protocol == 'https') {
          ret['http'] = { url: _provider.url };
        } else if( protocol == 'file' ) {
          ret['file']   = {};
        }

      }
    }
    return ret;

  } catch( e ) {
    throw e;
  } finally {
    arr1      = undefined;
    arr0      = undefined;
  }

}

module.exports._providerPaser = _providerPaser;