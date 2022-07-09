/*




*/
const Web3ABI                                    = require('web3-eth-abi');
const EtherAbi                                   = require('ethereumjs-abi')
function _encodeAbi( signature, ...args ) {

  try{
    return '0x' + EtherAbi.simpleEncode( signature, ...args ).toString('hex');
  }catch(e){
    console.log( e )
  }finally{

  }

}

function _encodeParams( types, values ) {

  try{
    return Web3ABI.encodeParameters( types, values );
  }catch(e){
    console.log( e )
  }finally{

  }

}

module.exports.encodeAbi     = _encodeAbi;
module.exports.encodeParams  = _encodeParams;