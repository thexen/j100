/*
  Prefix: LSH ( LPT Staking Holder )



*/
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryStakingRewardConst( stakingHolder, staker ) {
  try{
    var data = QueryChain().abi.encodeFunctionSignature( "inqueryStakingRewardConst()" );
    const val = await QueryChain().call({
      to: stakingHolder, 
      from: staker,
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint256','uint256','uint256','uint256','uint256','uint8','uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryLSHStakingRewardConst     = _inqueryStakingRewardConst;


