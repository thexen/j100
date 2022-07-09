//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }                                = require('../../common/types/ecodes');
const ipfsAPI                                       = require('ipfs-api');

const ipfs                                          = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

/*
j100 - QmXtUoYuTs6QUqPGY2yLTyeCyr4gv1a1TShU5AKmJZsD4J
bitcoin - QmS9rLESuDq1mhGxwh1eUaj9get5vfqKFmELusRBZxETvK
etherum - Qmbh4o7YLZKqTcJ6zhjhruvV6xpiAzmHbvbVHUbUM7yLom
klay - QmaCu1i5wZfpBFwZoNca7AM8Vjsg4dzd7EnDvT18w7quii
*/
var _ipfsGetFile = async function( _req, _res ){

  try {

    const files = await ipfs.get( _req.params.CID );
    _res.setHeader('Content-Type', 'image/svg+xml .svg .svgz');
    _res.end( files[0].content );
    
  } catch(e) {
    _res.statusCode = 501;
  } finally {
  }

}

module.exports.ipfsGetFile = _ipfsGetFile;