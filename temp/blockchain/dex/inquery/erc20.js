/*




*/
const { AbiEncode }                   = require ( '../../utils/abi.js' );
const { QueryChain }                  = require ( '../networks/active.js' );

async function _balanceOf( contract, owner ) {
  try{
    var data = await AbiEncode( "balanceOf(address)", owner );
    const val = await QueryChain().call({
      to: contract, 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

async function _allowance( contract, owner, spender ) {
  try{
    var data = await AbiEncode( "allowance(address,address)", owner,spender );
    const val = await QueryChain().call({
      to: contract, 
      data: data,
    });
    return QueryChain().abi.decodeParameters( ['uint256'], val );
  } catch( e ) {
    console.log(e)
  } finally {
  }
}

module.exports.BalanceOf           = _balanceOf;
module.exports.Allowance           = _allowance;