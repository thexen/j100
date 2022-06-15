/*
  Prefix: LSH ( LPT Staking Holder )



*/
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryStakingRewardConst( lptStakingHolder ) {
  try{
    var data = QueryChain().abi.encodeFunctionSignature( "inqueryStakingRewardConst()" );
    const val = await QueryChain().call({
      to: lptStakingHolder, 
      data: data,
    });

    //TODO 아래 코드로 변경 되어야 함
    return QueryChain().abi.decodeParameters( ['uint256','uint256','uint8','uint256'], val );
    //return [ obj["0"], obj["1"], obj["2"], obj["3"] ];

    //var obj = QueryChain().abi.decodeParameters( ['uint256','uint256','uint256','uint256','uint256','uint8','uint256'], val );
    //return [ obj["0"], obj["1"], obj["2"], obj["3"], obj["4"], obj["5"], obj["6"] ];

  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryLSHStakingRewardConst     = _inqueryStakingRewardConst;


