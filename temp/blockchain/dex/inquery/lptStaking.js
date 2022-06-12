/*




*/
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryStakingRewardConst( lptStakingHolder ) {
  try{
    var data = QueryChain().abi.encodeFunctionSignature( "inqueryStakingRewardConst()" );
    const val = await QueryChain().call({
      to: lptStakingHolder, 
      data: data,
    });
    var obj = QueryChain().abi.decodeParameters( ['uint256','uint256','uint8','uint256'], val );
    return [ obj["0"], obj["1"], obj["2"], obj["3"] ];
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryStakingRewardConst     = _inqueryStakingRewardConst;


