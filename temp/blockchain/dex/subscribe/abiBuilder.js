/*




*/
const { GetWeb3 }                                               = require ( '../networks/active.js' );
const { abiEventCompile }                                       = require ( './abiCompiler.js' );

/*
  SwapPoolFactory
  TokenManager
  DAO
  Voting
  SwapHelper
  Team Vault
  GToken
*/

function _building( router ) {
  
  let objs={};
  router.forEach( function( item ) {
    let dynimic = require ( item.file );
    var abi     = dynimic[item.abi ]();
    var key     = GetWeb3().utils.keccak256( abiEventCompile(abi) );
    var data    = {  name:      abi.name,
                    inputs:     abi.inputs,
                    callBack:   dynimic[ item.event]
    }
    objs[key] = data ;
  })
  return objs;

}


module.exports.abiBuild     = _building;