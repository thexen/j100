/*




*/
const abi = require('web3-eth-abi');

function _encodeAbi( signature, ...args ) {

  try{
    return '0x' + abi.simpleEncode( signature, ...args ).toString('hex');
  }catch(e){
    console.log( e )
  }finally{

  }

}

function _encodeParams( types, values ) {

  try{
    return abi.encodeParameters( types, values );
  }catch(e){
    console.log( e )
  }finally{

  }

}

module.exports.encodeAbi     = _encodeAbi;
module.exports.encodeParams  = _encodeParams;