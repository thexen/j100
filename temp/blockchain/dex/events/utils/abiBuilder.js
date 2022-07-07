/*




*/

const { abiEventCompile }                                       = require ( './abiCompiler.js' );
const Web3Utils                                                 = require('web3-utils');



/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

function _building( _router ) {

  let   objs  = {};
  try{
    _router.forEach( function( item ) {
      let dynamic = require ( item.file );
      var abi     = dynamic[ item.abi ]();
      var key     = Web3Utils.keccak256( abiEventCompile(abi) );
      var data    = { 
                      file:       item.file,
                      name:       abi.name,
                      inputs:     abi.inputs,
                      event:      dynamic[ item.event ]
                    }
    objs[key] = data ;
  })
  return objs;
  } catch( e ) {
    console.log( e );
  } finally {
    objs = undefined;
    web3 = undefined;
  }

}


module.exports.abiEventBuild     = _building;