//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//
//
//////////////////////////////////////////////////////////////////////////////////////////////////////
const crypto = require('../utils/crypto/hmac');

var _hmac256IS786Calculator = async function( _signatrue, _value ) {

  if( typeof _value != 'string' ){
    return await crypto.HMAC256IS786( _signatrue, _value.toString() );
  }else {
    return await crypto.HMAC256IS786( _signatrue, _value );
  } 

}

module.exports.HMAC256IS786Calculator = _hmac256IS786Calculator;


