/*
  Prefix: SH ( Swap Helper )



*/
const { AbiEncode }               = require ( '../../utils/abi.js' )
const { KlaySendTransaction }     = require( "../../wallet/sendtx.js");
const { GetContract }             = require ( '../contracts/contracts.js' );
const { GetNetwork }              = require ( '../networks/active.js' );

async function _exchange( wallet, from, amount, to, minimum, route ) {

  //Encoding ABI 
  try{    
    let data = await AbiEncode( "exchange(address,uint256,address,uint256,address[])"
                        , from
                        , amount
                        , to
                        , minimum
                        , route );

    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     GetContract("swapHelper"),
                            value:  0,
                            gas:    21000000,
                            input:  data,
                          }
                        });
  } catch( e ) {
    console.log(e)
  } finally {
  }                        
}

async function _test( wallet, newOwner ) {
    //Encoding ABI 
    try{    
      let data = await AbiEncode( "changeOwner(address)"
                          , newOwner );
  
      return await KlaySendTransaction( {
                            provider: {
                              url: GetNetwork(),
                            },
                            wallet: wallet,
                            rawTransaction: {
                              to:     '0xA59F83Fa82CeF4086D762259D589deAA3584fFFd',
                              value:  0,
                              gas:    21000000,
                              input:  data,
                            }
                          });
    } catch( e ) {
      console.log(e)
    } finally {
    }
}

module.exports.SHExchange           = _exchange;
module.exports.Test                 = _test;
