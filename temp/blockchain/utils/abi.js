/*




*/
const abi = require('ethereumjs-abi')

async function abiEncode( signature, ...args) {

  try{
    return '0x' + abi.simpleEncode( signature, ...args ).toString('hex');
  }catch(e){
    console.log( e )
  }finally{

  }

}

module.exports.AbiEncode  = abiEncode;