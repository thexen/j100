/*
  Prefix: SH ( Swap Helper )



*/
const { AbiEncode }               = require ( '../../utils/abi.js' )
const { KlaySendTransaction }     = require( "../../wallet/sendtx.js");
const { GetNetwork }              = require ( '../networks/active.js' );

async function _founding( wallet, swapPool, firstAmount, secondAmount, lptAmount, bTNC ) {

  //Encoding ABI 
  try {
    let value = 0;
    let data  = undefined;
    if( bTNC == undefined || !bTNC ) {
      data = await AbiEncode( "founding(uint256,uint256,uint256)"
                              , firstAmount
                              , secondAmount
                              , lptAmount );                              
    } else if( bTNC ) {
      value = secondAmount;
      data  = await AbiEncode( "founding(uint256,uint256,uint256)"
                              , firstAmount
                              , 0
                              , lptAmount );
    } else {
      throw Error( "bTNC is unknown" );
    }
    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     swapPool,
                            value:  value,
                            gas:    21000000,
                            input:  data,
                          }
                        });
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function _deposit( wallet, swapPool, firstAmount, secondAmount, bTNC ) {

  //Encoding ABI 
  try {
    let value = 0;
    let data  = undefined;
    if( bTNC == undefined || !bTNC ) {
      data = await AbiEncode( "deposit(uint256,uint256)"
                              , firstAmount
                              , secondAmount );                              
    } else if( bTNC ) {
      value = secondAmount;
      data  = await AbiEncode( "deposit(uint256,uint256)"
                              , firstAmount
                              , 0 );
    } else {
      throw Error( "bTNC is unknown" );
    }
    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     swapPool,
                            value:  value,
                            gas:    21000000,
                            input:  data,
                          }
                        });
  } catch( e ) {
    console.log(e)
  } finally {
  }

}

async function _withdrawal( wallet, swapPool, tokenIds ) {

  //Encoding ABI 
  try{    
    let data = await AbiEncode( "withdrawal(uint256[])", tokenIds );

    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     swapPool,
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

async function _withdrawalEx( wallet, swapPool, lptAmount ) {

  //Encoding ABI 
  try{    
    let data = await AbiEncode( "withdrawalEx(uint256)", lptAmount );

    return await KlaySendTransaction( {
                          provider: {
                            url: GetNetwork(),
                          },
                          wallet: wallet,
                          rawTransaction: {
                            to:     swapPool,
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

module.exports.Founding             = _founding;
module.exports.Deposit              = _deposit;
module.exports.WithdrawalEx         = _withdrawal;
module.exports.WithdrawalEx         = _withdrawalEx;

