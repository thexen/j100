//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
var _signature = async function( _signatureJson, _secretKey256 ){
    let signature   = _secretKey256 + '\r\n';
    let keys        = Object.keys( _signatureJson );
    try {
        keys.sort();
        for(var i=0; i<keys.length; i++) {
            signature += _signatureJson[ keys[i] ] + '\r\n';
        }
        return signature;
    } finally {
        keys = undefined;
    }
}

  module.exports.GenSignature = _signature;