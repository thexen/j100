/*




*/

const Web3                                                      = require('web3');
const { GetRPC }                                                = require ( '../../networks/provider.js' );
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

function _building( _web3, _router ) {
  let   web3  = undefined;
  let   objs  = {};

  if( _web3 == undefined )
    web3 = new Web3( new Web3.providers.HttpProvider( GetRPC() ) );
  else 
    web3 = _web3;
      
  try{
  _router.forEach( function( item ) {
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
  } catch( e ) {

  } finally {
    objs = undefined;
    web3 = undefined;
  }

}


module.exports.abiEventBuild     = _building;