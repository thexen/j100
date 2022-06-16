/*
  Prefix: SH ( Swap Helper )



*/
const { AbiEncode }               = require ( '../../utils/abi.js' )
const { KlaySendTransaction }     = require( "../../wallet/sendtx.js");
const { GetContract }             = require ( '../contracts/contracts.js' );
const { GetNetwork }              = require ( '../networks/active.js' );

async function _creatSwapPool( wallet, firstToken, secondToken, fee ) {

  //Encoding ABI 
  try{
    let data = undefined;
    if( firstToken == undefined || firstToken  == "0x0000000000000000000000000000000000000000" ) {
      throw Error( "firstToken must be ERC20" );
    } else if( secondToken == undefined || secondToken  == "0x00" || secondToken  == "0x0000000000000000000000000000000000000000" ) {
      data = await AbiEncode( "createTNCSwapPool(address,uint256)"
                              , firstToken
                              , fee );
    } else {
      data = await AbiEncode( "createTNTSwapPool(address,address,uint256)"
                              , firstToken
                              , secondToken
                              , fee );
    }

    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     GetContract("swapPoolFactory"),
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

module.exports.CreateSwapPool       = _creatSwapPool;

