/*




*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { GetContract }                 = require ( '../contracts/contracts.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _inqueryDailyStat( swapPool, date ) {
  try{
    var data = await AbiEncode( "inqueryDailyStat(address,uint256,uint256)"
                      , swapPool
                      , date
                      , 1 );
    const val = await QueryChain().call({
      to: GetContract("swapPoolManager"), 
      data: data,
    });

    //모르겠음, index(1부터), 시간 / 86400, first token 거래량, second token 거래량, first token 수수료 수익, second token 수수료 수익
    var dec = QueryChain().abi.decodeParameters(['uint256','uint256','uint256','uint256','uint256','uint256','uint256'], val );
    //console.log( dec );
    return dec;
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.InqueryDailyStat     = _inqueryDailyStat;
//dailyStat( "0x9A3a88729913267DEC84c3aac09499BD816f8DA4", (Date.now()/1000).toFixed(0) );

