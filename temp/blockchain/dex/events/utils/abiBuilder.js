/*




*/
// const { GetWeb3 }                                               = require ( '../../networks/active.js' );
const Web3                                                      = require('web3');
const { 
  GetBaoBabNetwork, 
  GetBaoBabWebSocket 
}                                                               = require ( '../../networks/klayBaobab.js' );
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
  const web3 = new Web3( new Web3.providers.HttpProvider( GetBaoBabNetwork() ) );

  let objs={};
  router.forEach( function( item ) {
    let dynimic = require ( item.file );
    var abi     = dynimic[item.abi ]();
    var key     = web3.utils.keccak256( abiEventCompile(abi) );
    var data    = { name:      abi.name,
                    inputs:     abi.inputs,
                    callBack:   dynimic[ item.event]
    }
    objs[key] = data ;
  })
  return objs;

}


module.exports.abiEventBuild     = _building;