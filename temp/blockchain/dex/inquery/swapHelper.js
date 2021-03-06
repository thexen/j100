/*
  Prefix: SH ( Swap Helper )



*/
const { AbiEncode }                   = require ( '../../utils/abi.js' )
const { GetContract }                 = require ( '../contracts/contracts.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryExpectedAmount( from, amount, to, route ) {
  try{
    var data = await AbiEncode( "inqueryExpectedReceipt(address,uint256,address,address[])"
                , from
                , amount
                , to
                , route );
    let val = await QueryChain().call({
      to: GetContract("swapHelper"), 
      data: data,});
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InquerySHExpectedAmount     = _inqueryExpectedAmount;