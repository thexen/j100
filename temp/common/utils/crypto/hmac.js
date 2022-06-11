//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const crypto = require('crypto');
const secretHMACKey = '!HMAC-SKEY::sjskwkfgktpdy@';

var _hmacHex = function( _plainText, _secretKey ) {
  let secretKey = _secretKey;
  if( _secretKey == undefined ){
    secretKey = secretHMACKey;
  }
  return crypto.createHmac('sha256', secretKey ).update(_plainText).digest('hex');
}

var _hmacDec = function( _plainText, _secretKey ) {

  let secretKey = _secretKey;
  if( _secretKey == undefined ){
    secretKey = secretHMACKey;
  }

  let buf = crypto.createHmac('sha256', secretKey ).update(_plainText).digest();
  let dec = '';
  for( var i=0; i<buf.length; i++){
    dec += buf[i]
  }	  
  return dec;
}

module.exports.HMAC256HEX = _hmacHex;
module.exports.HMAC256IS786 = _hmacDec;
