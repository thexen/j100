//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const { ErrorCodes }                                = require('../../common/types/ecodes');
const ipfsAPI                                       = require('ipfs-api');
const CID                                           = require('cids')
const ipfs                                          = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

/*
[CID -> CIDV1]
https://cid.ipfs.io/
[GateWay List]
https://ipfs.io/ipns/ipnso.com/?cid=QmXtUoYuTs6QUqPGY2yLTyeCyr4gv1a1TShU5AKmJZsD4J

j100 - QmXtUoYuTs6QUqPGY2yLTyeCyr4gv1a1TShU5AKmJZsD4J
bitcoin - QmS9rLESuDq1mhGxwh1eUaj9get5vfqKFmELusRBZxETvK
etherum - Qmbh4o7YLZKqTcJ6zhjhruvV6xpiAzmHbvbVHUbUM7yLom
klay - QmaCu1i5wZfpBFwZoNca7AM8Vjsg4dzd7EnDvT18w7quii

https://{cidv1}.ipfs.infura-ipfs.io/

//J100
https://ipfs.infura.io/ipfs/QmXtUoYuTs6QUqPGY2yLTyeCyr4gv1a1TShU5AKmJZsD4J
  - cidV1 : bafybeien4cityupyc5xeqyonnz5cxfldnkflqy5glq7mlzqiuolqikni34
  - https://bafybeien4cityupyc5xeqyonnz5cxfldnkflqy5glq7mlzqiuolqikni34.ipfs.infura-ipfs.io/

//WC  
https://ipfs.infura.io/ipfs/QmS9rLESuDq1mhGxwh1eUaj9get5vfqKFmELusRBZxETvK
 - cidV1 : bafybeibyvkadlgojlwgpb24jxk456ozvutq4qz4f7k43aljhhlwsq3pawq

  //Klay
https://ipfs.infura.io/ipfs/QmaCu1i5wZfpBFwZoNca7AM8Vjsg4dzd7EnDvT18w7quii
 - cidV1 : bafybeifqj7cqqbst5vw3bzrczreocc75qurfgc77j5j3c7kiphwcihdkem


https://ipfs.infura.io/ipfs/Qmbh4o7YLZKqTcJ6zhjhruvV6xpiAzmHbvbVHUbUM7yLom
 - cidV1 : bafybeiggmld52snt4oxc66tfdfujobqx7x2uso2pvgfoxaauam3yexyuuq



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

var _ipfsCID2CIDV1 = async function( _req, _res ) {

  let cid                   = _req.body.cid

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
    
  try {
    let cidV1   = new CID(cid).toV1().toString('base32');
    objs = {
      cidv1: cidV1
    };
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

    mongoClient     = undefined;
    objs            = undefined;
    bodyData        = undefined;

  }
}

var _ipfsGateway = async function( _req, _res ) {

  let reason                = "";
  let code                  = ErrorCodes.OK;
  let bodyData              = "{}";
  let objs                  = undefined;
    
  try {
    objs = {
      gateways: [
        { gateway: 'ipfs.infura-ipfs.io/',        version: 'v1' },
        { gateway: '127.0.0.1:8080/ipfs/get/',    version: 'v0' }
       ],
    };
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

    mongoClient     = undefined;
    objs            = undefined;
    bodyData        = undefined;

  }

}

module.exports.ipfsGetFile    = _ipfsGetFile;
module.exports.ipfsCID2CIDV1  = _ipfsCID2CIDV1;
module.exports.ipfsGeteway    = _ipfsGateway;